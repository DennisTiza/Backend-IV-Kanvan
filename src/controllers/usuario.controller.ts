import {service} from '@loopback/core';
import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  repository,
  Where,
} from '@loopback/repository';
import {
  del,
  get,
  getModelSchemaRef,
  HttpErrors,
  param,
  patch,
  post,
  put,
  requestBody,
  response,
} from '@loopback/rest';
import {CambioClave, Credenciales, Login, Usuario} from '../models';
import {LoginRepository, UsuarioRepository} from '../repositories';
import {SeguridadUsuarioService} from '../services';

export class UsuarioController {
  constructor(
    @repository(UsuarioRepository)
    public usuarioRepository: UsuarioRepository,
    @service(SeguridadUsuarioService)
    public seguridadUsuarioService: SeguridadUsuarioService,
    @repository(LoginRepository)
    public loginRepository: LoginRepository,
  ) { }

  @post('/usuario')
  @response(200, {
    description: 'Usuario model instance',
    content: {'application/json': {schema: getModelSchemaRef(Usuario)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Usuario, {
            title: 'NewUsuario',
            exclude: ['id'],
          }),
        },
      },
    })
    usuario: Omit<Usuario, 'id'>,
  ): Promise<Usuario> {
    // Verificar si ya existe un usuario con el mismo correo
    const existente = await this.usuarioRepository.findOne({
      where: {correo: usuario.correo},
    });

    if (existente) {
      throw new HttpErrors.UnprocessableEntity(`El correo '${usuario.correo}' ya está en uso.`);
    }

    // Cifrar la clave
    try {
      usuario.clave = this.seguridadUsuarioService.cifrarTexto(usuario.clave);
    } catch (error) {
      throw new HttpErrors.InternalServerError('Error al cifrar la clave del usuario.');
    }

    return this.usuarioRepository.create(usuario);
  }

  @get('/usuario/count')
  @response(200, {
    description: 'Usuario model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(Usuario) where?: Where<Usuario>,
  ): Promise<Count> {
    return this.usuarioRepository.count(where);
  }

  @get('/usuario')
  @response(200, {
    description: 'Array of Usuario model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Usuario, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(Usuario) filter?: Filter<Usuario>,
  ): Promise<Usuario[]> {
    return this.usuarioRepository.find(filter);
  }

  @patch('/usuario')
  @response(200, {
    description: 'Usuario PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Usuario, {partial: true}),
        },
      },
    })
    usuario: Usuario,
    @param.where(Usuario) where?: Where<Usuario>,
  ): Promise<Count> {
    return this.usuarioRepository.updateAll(usuario, where);
  }

  @get('/usuario/{id}')
  @response(200, {
    description: 'Usuario model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Usuario, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(Usuario, {exclude: 'where'}) filter?: FilterExcludingWhere<Usuario>
  ): Promise<Usuario> {
    return this.usuarioRepository.findById(id, filter);
  }

  @patch('/usuario/{id}')
  @response(204, {
    description: 'Usuario PATCH success',
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Usuario, {partial: true}),
        },
      },
    })
    usuario: Usuario,
  ): Promise<void> {
    await this.usuarioRepository.updateById(id, usuario);
  }

  @put('/usuario/{id}')
  @response(204, {
    description: 'Usuario PUT success',
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() usuario: Usuario,
  ): Promise<void> {
    if (usuario.clave) {
      usuario.clave = this.seguridadUsuarioService.cifrarTexto(usuario.clave);
    }

    if (usuario.correo) {
      let usuarioExistenteCorreo = await this.usuarioRepository.findOne({
        where: {correo: usuario.correo, id: {neq: id}},
      });
      if (usuarioExistenteCorreo) {
        throw new HttpErrors.BadRequest(`El correo '${usuario.correo}' ya se encuentra en uso por otro usuario.`);
      }
    }
    await this.usuarioRepository.replaceById(id, usuario);
  }

  @del('/usuario/{id}')
  @response(204, {
    description: 'Usuario DELETE success',
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.usuarioRepository.deleteById(id);
  }

  @post('/identificar-usuario')
  @response(200, {
    description: 'Identificar un usuario por correo y clave',
    content: {'application/json': {schema: getModelSchemaRef(Usuario)}},
  })
  async identificarUsuario(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Credenciales),
        },
      },
    })
    credentials: Credenciales,
  ): Promise<object> {
    const user = await this.seguridadUsuarioService.identificarUsuario(credentials);
    const fechaRegistro = new Date().toLocaleString('sv-SE', {timeZone: 'America/Bogota'});
    if (user) {
      // Generar token y registrar el login con token
      const token = this.seguridadUsuarioService.crearToken(user);
      let login: Login = new Login();
      login.usuarioId = user.id!;
      login.fecha = fechaRegistro;
      login.token = token;
      await this.loginRepository.create(login);

      // Obtener permisos del usuario basados en su rol
      const menu = await this.seguridadUsuarioService.ConsultarPermisosDeMenuPorUsuario(user.rolId!);

      return {user, token, menu};
    }
    throw new HttpErrors.Unauthorized('Credenciales incorrectas.');
  }



  /* El método `cambiarClave` es un endpoint POST que permite al usuario
cambiar su contraseña. Se necesita un cuerpo de solicitud que contiene el
modelo `CambioClave`, que representa la dirección de correo electrónico del
usuario, su contraseña actual y la contraseña nueva. */

  @patch('/cambiar-clave')
  @response(200, {
    description: 'Usuario model instance',
    content: {'application/json': {schema: getModelSchemaRef(Usuario)}},
  })
  async cambiarClave(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(CambioClave, {partial: true}),
        },
      },
    })
    cambioClave: CambioClave,
  ): Promise<object> {
    const credenciales = {
      correo: cambioClave.correo,
      clave: cambioClave.claveActual,
    };

    //Cifrar la clave ingresada por el usuario.
    credenciales.clave = this.seguridadUsuarioService.cifrarTexto(credenciales.clave);

    // Buscar al usuario que corresponda con las credenciales ingresadas.
    const usuario = await this.usuarioRepository.findOne({
      where: {
        correo: credenciales.correo,
        clave: credenciales.clave,
      },
    });

    // Verificar si el usuario existe.
    if (!usuario) {
      throw new HttpErrors.NotFound('Usuario no encontrado');
    }

    // Verificar si la contraseña actual es correcta utilizando la función identificarUsuario
    const credenciales2: Credenciales = credenciales as unknown as Credenciales;
    let usuarioAutenticado =
      await this.seguridadUsuarioService.identificarUsuario(credenciales2);

    if (!usuarioAutenticado) {
      throw new HttpErrors.Unauthorized('Contraseña actual incorrecta');
    }

    // Asignar la contraseña nueva y actualizar el usuario.
    let nuevaClave = cambioClave.claveNueva;
    let nuevaClaveCifrada = this.seguridadUsuarioService.cifrarTexto(nuevaClave);
    usuario.clave = nuevaClaveCifrada;
    await this.usuarioRepository.updateById(usuario.getId(), usuario);
    return usuario;
  }
}


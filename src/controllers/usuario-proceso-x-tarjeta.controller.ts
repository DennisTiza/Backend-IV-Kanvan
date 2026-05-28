import {
  Count,
  CountSchema,
  Filter,
  repository,
  Where,
} from '@loopback/repository';
import {
  del,
  get,
  getModelSchemaRef,
  getWhereSchemaFor,
  param,
  patch,
  post,
  requestBody,
} from '@loopback/rest';
import {
  Usuario,
  ProcesoXTarjeta,
} from '../models';
import {UsuarioRepository} from '../repositories';

export class UsuarioProcesoXTarjetaController {
  constructor(
    @repository(UsuarioRepository) protected usuarioRepository: UsuarioRepository,
  ) { }

  @get('/usuarios/{id}/proceso-x-tarjetas', {
    responses: {
      '200': {
        description: 'Array of Usuario has many ProcesoXTarjeta',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(ProcesoXTarjeta)},
          },
        },
      },
    },
  })
  async find(
    @param.path.number('id') id: number,
    @param.query.object('filter') filter?: Filter<ProcesoXTarjeta>,
  ): Promise<ProcesoXTarjeta[]> {
    return this.usuarioRepository.procesoXTarjetas(id).find(filter);
  }

  @post('/usuarios/{id}/proceso-x-tarjetas', {
    responses: {
      '200': {
        description: 'Usuario model instance',
        content: {'application/json': {schema: getModelSchemaRef(ProcesoXTarjeta)}},
      },
    },
  })
  async create(
    @param.path.number('id') id: typeof Usuario.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(ProcesoXTarjeta, {
            title: 'NewProcesoXTarjetaInUsuario',
            exclude: ['id'],
            optional: ['usuarioId']
          }),
        },
      },
    }) procesoXTarjeta: Omit<ProcesoXTarjeta, 'id'>,
  ): Promise<ProcesoXTarjeta> {
    return this.usuarioRepository.procesoXTarjetas(id).create(procesoXTarjeta);
  }

  @patch('/usuarios/{id}/proceso-x-tarjetas', {
    responses: {
      '200': {
        description: 'Usuario.ProcesoXTarjeta PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(ProcesoXTarjeta, {partial: true}),
        },
      },
    })
    procesoXTarjeta: Partial<ProcesoXTarjeta>,
    @param.query.object('where', getWhereSchemaFor(ProcesoXTarjeta)) where?: Where<ProcesoXTarjeta>,
  ): Promise<Count> {
    return this.usuarioRepository.procesoXTarjetas(id).patch(procesoXTarjeta, where);
  }

  @del('/usuarios/{id}/proceso-x-tarjetas', {
    responses: {
      '200': {
        description: 'Usuario.ProcesoXTarjeta DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.number('id') id: number,
    @param.query.object('where', getWhereSchemaFor(ProcesoXTarjeta)) where?: Where<ProcesoXTarjeta>,
  ): Promise<Count> {
    return this.usuarioRepository.procesoXTarjetas(id).delete(where);
  }
}

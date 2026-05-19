import { /* inject, */ BindingScope, injectable} from '@loopback/core';
import {repository} from '@loopback/repository';
import {ConfiguracionSeguridad} from '../config/seguridad.config';
import {
  Credenciales,
  MenuDelRol,
  Usuario,
} from '../models';
import {
  LoginRepository,
  MenuDelRolRepository,
  UsuarioRepository,
} from '../repositories';
const jwt = require('jsonwebtoken');
const MD5 = require('crypto-js/MD5');

@injectable({scope: BindingScope.TRANSIENT})
export class SeguridadUsuarioService {
  constructor(
    @repository(UsuarioRepository)
    public repositoryUsuario: UsuarioRepository,
    @repository(LoginRepository)
    public repositorioLogin: LoginRepository,
    @repository(MenuDelRolRepository)
    public repositoryRolMenu: MenuDelRolRepository,

  ) { }

  /**
   * La función cifrarTexto toma una cadena como entrada, la cifra usando el
   * algoritmo MD5 y devuelve la cadena cifrada.
   * @param {string} clave - El parámetro "clave" es una cadena que representa la
   * clave utilizada para el cifrado.
   * @returns el texto cifrado (cadenaCifrada) tras aplicar el algoritmo de cifrado
   * MD5 a la clave de entrada.
   */
  cifrarTexto(clave: string): string {
    let cadenaCifrada = MD5(clave).toString();
    return cadenaCifrada;
  }

  GeneralTextoAleatorio(n: number): string {
    let caracteres = 'abcdefghijkmnpqrtuvwxyzABCDEFGHIJKLMNPQRTUVWXYZ2346789';
    let clave = '';
    for (let i = 0; i < n; i++)
      clave += caracteres.charAt(Math.floor(Math.random() * caracteres.length));
    return clave;
  }

  crearToken(usuario: Usuario): string {
    const datos = {
      id: usuario.id,
      name: `${usuario.nombre} ${usuario.apellido}`,
      role: usuario.rolId,
      email: usuario.correo,
    };
    const token = jwt.sign(datos, ConfiguracionSeguridad.claveJWT, {expiresIn: '12h'});
    return token;
  }

  ObtenerRolDesdeToken(tk: string): number {
    const obj: any = jwt.verify(tk, ConfiguracionSeguridad.claveJWT);
    return Number(obj.role);
  }

  /**
   * La función `identificarUsuario` toma las credenciales y devuelve un objeto de
   * usuario si las credenciales coinciden, de lo contrario devuelve nulo.
   * @param {Credenciales} credenciales - El parámetro "credenciales" es de tipo
   * "Credenciales". Es un objeto que contiene las credenciales del usuario,
   * específicamente su dirección de correo electrónico y contraseña.
   * @returns una Promesa que se resuelve en un objeto Usuario o nula.
   */
  async identificarUsuario(credenciales: Credenciales): Promise<Usuario | null> {
    // Cifrar la clave recibida para compararla con la almacenada
    const claveCifrada = this.cifrarTexto(credenciales.clave);
    let usuario = await this.repositoryUsuario.findOne({
      where: {
        correo: credenciales.correo,
        clave: claveCifrada,
      },
    });
    console.log(usuario);
    return usuario as Usuario;
  }


  /**
   * Retorna los permisos del rol incluyendo todas las acciones disponibles
   * @param idRol id del rol a buscar y que está asociado al usuario
   * @returns array de permisos con todos los menuId asociados al rol
   */
  async ConsultarPermisosDeMenuPorUsuario(idRol: number): Promise<MenuDelRol[]> {
    let menu: MenuDelRol[] = await this.repositoryRolMenu.find(
      {
        where: {
          rolId: idRol
        }
      }
    );
    return menu;
  }


  //necesito un metodo que dado un correo, me busque en la base de datos, si el correo esta en la base me muestre un error
  //si el correo no esta en la base me permita crear un usuario nuevo
  async buscarUsuarioPorCorreo(correo: string): Promise<Usuario | null> {
    let usuario = await this.repositoryUsuario.findOne({
      where: {
        correo: correo,
      },
    });
    return usuario as Usuario;
  }
}

import {Entity, hasMany, model, property} from '@loopback/repository';
import {MenuDelRol} from './menu-del-rol.model';
import {Menu} from './menu.model';
import {Usuario} from './usuario.model';

@model()
export class Rol extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  id?: number;

  @property({
    type: 'string',
    required: true,
  })
  Nombre: string;

  @property({
    type: 'string',
    required: true,
  })
  Comentario: string;

  @hasMany(() => Menu, {through: {model: () => MenuDelRol}})
  menus: Menu[];

  @hasMany(() => Usuario)
  usuarios: Usuario[];

  constructor(data?: Partial<Rol>) {
    super(data);
  }
}

export interface RolRelations {
  // describe navigational properties here
}

export type RolWithRelations = Rol & RolRelations;

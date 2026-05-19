import {Entity, hasMany, model, property} from '@loopback/repository';
import {MenuDelRol} from './menu-del-rol.model';
import {Rol} from './rol.model';

@model()
export class Menu extends Entity {
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

  @hasMany(() => Rol, {through: {model: () => MenuDelRol}})
  rols: Rol[];

  constructor(data?: Partial<Menu>) {
    super(data);
  }
}

export interface MenuRelations {
  // describe navigational properties here
}

export type MenuWithRelations = Menu & MenuRelations;

import {Entity, model, property} from '@loopback/repository';

@model(
  {
    /**
    settings: {
      foreignKeys: {
        fk_menuId_Menudelrol: {
          name: 'fk_menuId_Menudelrol',
          entity: 'Menu',
          entityKey: 'id',
          foreignKey: 'menuId',
        },
        fk_rolId_Menudelrol: {
          name: 'fk_rolId_Menudelrol',
          entity: 'Rol',
          entityKey: 'id',
          foreignKey: 'rolId',
        },
      },
    },
      */
  }
)
export class MenuDelRol extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  id?: number;

  @property({
    type: 'boolean',
    required: true,
  })
  Listar: boolean;

  @property({
    type: 'boolean',
    required: true,
  })
  Guardar: boolean;

  @property({
    type: 'boolean',
    required: true,
  })
  Editar: boolean;

  @property({
    type: 'boolean',
    required: true,
  })
  Eliminar: boolean;

  @property({
    type: 'boolean',
    required: true,
  })
  Descargar: boolean;

  @property({
    type: 'number',
  })
  menuId?: number;

  @property({
    type: 'number',
  })
  rolId?: number;

  constructor(data?: Partial<MenuDelRol>) {
    super(data);
  }
}

export interface MenuDelRolRelations {
  // describe navigational properties here
}

export type MenuDelRolWithRelations = MenuDelRol & MenuDelRolRelations;

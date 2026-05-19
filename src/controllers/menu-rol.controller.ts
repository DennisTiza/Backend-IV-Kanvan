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
  Menu,
  Rol
} from '../models';
import {MenuRepository} from '../repositories';

export class MenuRolController {
  constructor(
    @repository(MenuRepository) protected menuRepository: MenuRepository,
  ) { }

  @get('/menus/{id}/rols', {
    responses: {
      '200': {
        description: 'Array of Menu has many Rol through MenuDelRol',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Rol)},
          },
        },
      },
    },
  })
  async find(
    @param.path.number('id') id: number,
    @param.query.object('filter') filter?: Filter<Rol>,
  ): Promise<Rol[]> {
    return this.menuRepository.rols(id).find(filter);
  }

  @post('/menus/{id}/rols', {
    responses: {
      '200': {
        description: 'create a Rol model instance',
        content: {'application/json': {schema: getModelSchemaRef(Rol)}},
      },
    },
  })
  async create(
    @param.path.number('id') id: typeof Menu.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Rol, {
            title: 'NewRolInMenu',
            exclude: ['id'],
          }),
        },
      },
    }) rol: Omit<Rol, 'id'>,
  ): Promise<Rol> {
    return this.menuRepository.rols(id).create(rol);
  }

  @patch('/menus/{id}/rols', {
    responses: {
      '200': {
        description: 'Menu.Rol PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Rol, {partial: true}),
        },
      },
    })
    rol: Partial<Rol>,
    @param.query.object('where', getWhereSchemaFor(Rol)) where?: Where<Rol>,
  ): Promise<Count> {
    return this.menuRepository.rols(id).patch(rol, where);
  }

  @del('/menus/{id}/rols', {
    responses: {
      '200': {
        description: 'Menu.Rol DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.number('id') id: number,
    @param.query.object('where', getWhereSchemaFor(Rol)) where?: Where<Rol>,
  ): Promise<Count> {
    return this.menuRepository.rols(id).delete(where);
  }
}

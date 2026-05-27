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
  param,
  patch,
  post,
  put,
  requestBody,
  response,
} from '@loopback/rest';
import {ProductoXProceso} from '../models';
import {ProductoXProcesoRepository} from '../repositories';

export class ProductoXProcesoController {
  constructor(
    @repository(ProductoXProcesoRepository)
    public productoXProcesoRepository: ProductoXProcesoRepository,
  ) { }

  @post('/producto-x-proceso')
  @response(200, {
    description: 'ProductoXProceso model instance',
    content: {'application/json': {schema: getModelSchemaRef(ProductoXProceso)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(ProductoXProceso, {
            title: 'NewProductoXProceso',
            exclude: ['id'],
          }),
        },
      },
    })
    productoXProceso: Omit<ProductoXProceso, 'id'>,
  ): Promise<ProductoXProceso> {
    return this.productoXProcesoRepository.create(productoXProceso);
  }

  @get('/producto-x-proceso/count')
  @response(200, {
    description: 'ProductoXProceso model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(ProductoXProceso) where?: Where<ProductoXProceso>,
  ): Promise<Count> {
    return this.productoXProcesoRepository.count(where);
  }

  @get('/producto-x-proceso')
  @response(200, {
    description: 'Array of ProductoXProceso model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(ProductoXProceso, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(ProductoXProceso) filter?: Filter<ProductoXProceso>,
  ): Promise<ProductoXProceso[]> {
    return this.productoXProcesoRepository.find(filter);
  }

  @get('/producto-x-proceso/producto/{productoId}')
  @response(200, {
    description: 'Array of ProductoXProceso model instances for a productoId',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(ProductoXProceso, {includeRelations: true}),
        },
      },
    },
  })
  async findByProductoId(
    @param.path.number('productoId') productoId: number,
  ): Promise<ProductoXProceso[]> {
    return this.productoXProcesoRepository.find({where: {productoId}});
  }

  @patch('/producto-x-proceso')
  @response(200, {
    description: 'ProductoXProceso PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(ProductoXProceso, {partial: true}),
        },
      },
    })
    productoXProceso: ProductoXProceso,
    @param.where(ProductoXProceso) where?: Where<ProductoXProceso>,
  ): Promise<Count> {
    return this.productoXProcesoRepository.updateAll(productoXProceso, where);
  }

  @get('/producto-x-proceso/{id}')
  @response(200, {
    description: 'ProductoXProceso model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(ProductoXProceso, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(ProductoXProceso, {exclude: 'where'}) filter?: FilterExcludingWhere<ProductoXProceso>
  ): Promise<ProductoXProceso> {
    return this.productoXProcesoRepository.findById(id, filter);
  }



  @patch('/producto-x-proceso/{id}')
  @response(204, {
    description: 'ProductoXProceso PATCH success',
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(ProductoXProceso, {partial: true}),
        },
      },
    })
    productoXProceso: ProductoXProceso,
  ): Promise<void> {
    await this.productoXProcesoRepository.updateById(id, productoXProceso);
  }

  @put('/producto-x-proceso/{id}')
  @response(204, {
    description: 'ProductoXProceso PUT success',
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() productoXProceso: ProductoXProceso,
  ): Promise<void> {
    await this.productoXProcesoRepository.replaceById(id, productoXProceso);
  }

  @del('/producto-x-proceso/{id}')
  @response(204, {
    description: 'ProductoXProceso DELETE success',
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.productoXProcesoRepository.deleteById(id);
  }
}

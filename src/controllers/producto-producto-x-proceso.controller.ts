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
  Producto,
  ProductoXProceso,
} from '../models';
import {ProductoRepository} from '../repositories';

export class ProductoProductoXProcesoController {
  constructor(
    @repository(ProductoRepository) protected productoRepository: ProductoRepository,
  ) { }

  @get('/productos/{id}/producto-x-procesos', {
    responses: {
      '200': {
        description: 'Array of Producto has many ProductoXProceso',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(ProductoXProceso)},
          },
        },
      },
    },
  })
  async find(
    @param.path.number('id') id: number,
    @param.query.object('filter') filter?: Filter<ProductoXProceso>,
  ): Promise<ProductoXProceso[]> {
    return this.productoRepository.productoXProcesos(id).find(filter);
  }

  @post('/productos/{id}/producto-x-procesos', {
    responses: {
      '200': {
        description: 'Producto model instance',
        content: {'application/json': {schema: getModelSchemaRef(ProductoXProceso)}},
      },
    },
  })
  async create(
    @param.path.number('id') id: typeof Producto.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(ProductoXProceso, {
            title: 'NewProductoXProcesoInProducto',
            exclude: ['id'],
            optional: ['productoId']
          }),
        },
      },
    }) productoXProceso: Omit<ProductoXProceso, 'id'>,
  ): Promise<ProductoXProceso> {
    return this.productoRepository.productoXProcesos(id).create(productoXProceso);
  }

  @patch('/productos/{id}/producto-x-procesos', {
    responses: {
      '200': {
        description: 'Producto.ProductoXProceso PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(ProductoXProceso, {partial: true}),
        },
      },
    })
    productoXProceso: Partial<ProductoXProceso>,
    @param.query.object('where', getWhereSchemaFor(ProductoXProceso)) where?: Where<ProductoXProceso>,
  ): Promise<Count> {
    return this.productoRepository.productoXProcesos(id).patch(productoXProceso, where);
  }

  @del('/productos/{id}/producto-x-procesos', {
    responses: {
      '200': {
        description: 'Producto.ProductoXProceso DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.number('id') id: number,
    @param.query.object('where', getWhereSchemaFor(ProductoXProceso)) where?: Where<ProductoXProceso>,
  ): Promise<Count> {
    return this.productoRepository.productoXProcesos(id).delete(where);
  }
}

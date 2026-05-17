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
  Proceso,
  ProductoXProceso,
} from '../models';
import {ProcesoRepository} from '../repositories';

export class ProcesoProductoXProcesoController {
  constructor(
    @repository(ProcesoRepository) protected procesoRepository: ProcesoRepository,
  ) { }

  @get('/procesos/{id}/producto-x-procesos', {
    responses: {
      '200': {
        description: 'Array of Proceso has many ProductoXProceso',
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
    return this.procesoRepository.productoXProcesos(id).find(filter);
  }

  @post('/procesos/{id}/producto-x-procesos', {
    responses: {
      '200': {
        description: 'Proceso model instance',
        content: {'application/json': {schema: getModelSchemaRef(ProductoXProceso)}},
      },
    },
  })
  async create(
    @param.path.number('id') id: typeof Proceso.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(ProductoXProceso, {
            title: 'NewProductoXProcesoInProceso',
            exclude: ['id'],
            optional: ['procesoId']
          }),
        },
      },
    }) productoXProceso: Omit<ProductoXProceso, 'id'>,
  ): Promise<ProductoXProceso> {
    return this.procesoRepository.productoXProcesos(id).create(productoXProceso);
  }

  @patch('/procesos/{id}/producto-x-procesos', {
    responses: {
      '200': {
        description: 'Proceso.ProductoXProceso PATCH success count',
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
    return this.procesoRepository.productoXProcesos(id).patch(productoXProceso, where);
  }

  @del('/procesos/{id}/producto-x-procesos', {
    responses: {
      '200': {
        description: 'Proceso.ProductoXProceso DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.number('id') id: number,
    @param.query.object('where', getWhereSchemaFor(ProductoXProceso)) where?: Where<ProductoXProceso>,
  ): Promise<Count> {
    return this.procesoRepository.productoXProcesos(id).delete(where);
  }
}

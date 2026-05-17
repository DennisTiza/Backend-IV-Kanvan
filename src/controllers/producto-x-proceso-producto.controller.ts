import {
  repository,
} from '@loopback/repository';
import {
  param,
  get,
  getModelSchemaRef,
} from '@loopback/rest';
import {
  ProductoXProceso,
  Producto,
} from '../models';
import {ProductoXProcesoRepository} from '../repositories';

export class ProductoXProcesoProductoController {
  constructor(
    @repository(ProductoXProcesoRepository)
    public productoXProcesoRepository: ProductoXProcesoRepository,
  ) { }

  @get('/producto-x-procesos/{id}/producto', {
    responses: {
      '200': {
        description: 'Producto belonging to ProductoXProceso',
        content: {
          'application/json': {
            schema: getModelSchemaRef(Producto),
          },
        },
      },
    },
  })
  async getProducto(
    @param.path.number('id') id: typeof ProductoXProceso.prototype.id,
  ): Promise<Producto> {
    return this.productoXProcesoRepository.producto(id);
  }
}

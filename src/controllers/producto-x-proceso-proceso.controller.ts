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
  Proceso,
} from '../models';
import {ProductoXProcesoRepository} from '../repositories';

export class ProductoXProcesoProcesoController {
  constructor(
    @repository(ProductoXProcesoRepository)
    public productoXProcesoRepository: ProductoXProcesoRepository,
  ) { }

  @get('/producto-x-procesos/{id}/proceso', {
    responses: {
      '200': {
        description: 'Proceso belonging to ProductoXProceso',
        content: {
          'application/json': {
            schema: getModelSchemaRef(Proceso),
          },
        },
      },
    },
  })
  async getProceso(
    @param.path.number('id') id: typeof ProductoXProceso.prototype.id,
  ): Promise<Proceso> {
    return this.productoXProcesoRepository.proceso(id);
  }
}

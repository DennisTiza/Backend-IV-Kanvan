import {
  repository,
} from '@loopback/repository';
import {
  param,
  get,
  getModelSchemaRef,
} from '@loopback/rest';
import {
  TarjetaDeProduccion,
  Producto,
} from '../models';
import {TarjetaDeProduccionRepository} from '../repositories';

export class TarjetaDeProduccionProductoController {
  constructor(
    @repository(TarjetaDeProduccionRepository)
    public tarjetaDeProduccionRepository: TarjetaDeProduccionRepository,
  ) { }

  @get('/tarjeta-de-produccions/{id}/producto', {
    responses: {
      '200': {
        description: 'Producto belonging to TarjetaDeProduccion',
        content: {
          'application/json': {
            schema: getModelSchemaRef(Producto),
          },
        },
      },
    },
  })
  async getProducto(
    @param.path.number('id') id: typeof TarjetaDeProduccion.prototype.id,
  ): Promise<Producto> {
    return this.tarjetaDeProduccionRepository.producto(id);
  }
}

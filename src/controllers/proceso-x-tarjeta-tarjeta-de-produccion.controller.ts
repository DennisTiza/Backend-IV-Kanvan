import {
  repository,
} from '@loopback/repository';
import {
  param,
  get,
  getModelSchemaRef,
} from '@loopback/rest';
import {
  ProcesoXTarjeta,
  TarjetaDeProduccion,
} from '../models';
import {ProcesoXTarjetaRepository} from '../repositories';

export class ProcesoXTarjetaTarjetaDeProduccionController {
  constructor(
    @repository(ProcesoXTarjetaRepository)
    public procesoXTarjetaRepository: ProcesoXTarjetaRepository,
  ) { }

  @get('/proceso-x-tarjetas/{id}/tarjeta-de-produccion', {
    responses: {
      '200': {
        description: 'TarjetaDeProduccion belonging to ProcesoXTarjeta',
        content: {
          'application/json': {
            schema: getModelSchemaRef(TarjetaDeProduccion),
          },
        },
      },
    },
  })
  async getTarjetaDeProduccion(
    @param.path.number('id') id: typeof ProcesoXTarjeta.prototype.id,
  ): Promise<TarjetaDeProduccion> {
    return this.procesoXTarjetaRepository.tarjetaDeProduccion(id);
  }
}

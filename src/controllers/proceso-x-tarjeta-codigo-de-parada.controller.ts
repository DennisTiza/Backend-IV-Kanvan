import {
  repository,
} from '@loopback/repository';
import {
  get,
  getModelSchemaRef,
  param,
} from '@loopback/rest';
import {
  CodigoDeParada,
  ProcesoXTarjeta,
} from '../models';
import {ProcesoXTarjetaRepository} from '../repositories';

export class ProcesoXTarjetaCodigoDeParadaController {
  constructor(
    @repository(ProcesoXTarjetaRepository)
    public procesoXTarjetaRepository: ProcesoXTarjetaRepository,
  ) { }

  @get('/proceso-x-tarjetas/{id}/codigo-de-parada', {
    responses: {
      '200': {
        description: 'CodigoDeParada belonging to ProcesoXTarjeta',
        content: {
          'application/json': {
            schema: getModelSchemaRef(CodigoDeParada),
          },
        },
      },
    },
  })
  async getCodigoDeParada(
    @param.path.number('id') id: typeof ProcesoXTarjeta.prototype.id,
  ): Promise<CodigoDeParada> {
    return this.procesoXTarjetaRepository.codigoDeParada(id);
  }
}

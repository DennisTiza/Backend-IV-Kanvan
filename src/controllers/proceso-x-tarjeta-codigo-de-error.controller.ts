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
  CodigoDeError,
} from '../models';
import {ProcesoXTarjetaRepository} from '../repositories';

export class ProcesoXTarjetaCodigoDeErrorController {
  constructor(
    @repository(ProcesoXTarjetaRepository)
    public procesoXTarjetaRepository: ProcesoXTarjetaRepository,
  ) { }

  @get('/proceso-x-tarjetas/{id}/codigo-de-error', {
    responses: {
      '200': {
        description: 'CodigoDeError belonging to ProcesoXTarjeta',
        content: {
          'application/json': {
            schema: getModelSchemaRef(CodigoDeError),
          },
        },
      },
    },
  })
  async getCodigoDeError(
    @param.path.number('id') id: typeof ProcesoXTarjeta.prototype.id,
  ): Promise<CodigoDeError> {
    return this.procesoXTarjetaRepository.codigoDeError(id);
  }
}

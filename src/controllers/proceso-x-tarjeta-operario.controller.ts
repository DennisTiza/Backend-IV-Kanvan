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
  Operario,
} from '../models';
import {ProcesoXTarjetaRepository} from '../repositories';

export class ProcesoXTarjetaOperarioController {
  constructor(
    @repository(ProcesoXTarjetaRepository)
    public procesoXTarjetaRepository: ProcesoXTarjetaRepository,
  ) { }

  @get('/proceso-x-tarjetas/{id}/operario', {
    responses: {
      '200': {
        description: 'Operario belonging to ProcesoXTarjeta',
        content: {
          'application/json': {
            schema: getModelSchemaRef(Operario),
          },
        },
      },
    },
  })
  async getOperario(
    @param.path.number('id') id: typeof ProcesoXTarjeta.prototype.id,
  ): Promise<Operario> {
    return this.procesoXTarjetaRepository.operario(id);
  }
}

import {
  repository,
} from '@loopback/repository';
import {
  param,
  get,
  getModelSchemaRef,
} from '@loopback/rest';
import {
  OperarioXProcesoXTarjeta,
  Operario,
} from '../models';
import {OperarioXProcesoXTarjetaRepository} from '../repositories';

export class OperarioXProcesoXTarjetaOperarioController {
  constructor(
    @repository(OperarioXProcesoXTarjetaRepository)
    public operarioXProcesoXTarjetaRepository: OperarioXProcesoXTarjetaRepository,
  ) { }

  @get('/operario-x-proceso-x-tarjetas/{id}/operario', {
    responses: {
      '200': {
        description: 'Operario belonging to OperarioXProcesoXTarjeta',
        content: {
          'application/json': {
            schema: getModelSchemaRef(Operario),
          },
        },
      },
    },
  })
  async getOperario(
    @param.path.number('id') id: typeof OperarioXProcesoXTarjeta.prototype.id,
  ): Promise<Operario> {
    return this.operarioXProcesoXTarjetaRepository.operario(id);
  }
}

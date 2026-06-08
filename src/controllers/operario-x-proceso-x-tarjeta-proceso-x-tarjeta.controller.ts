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
  ProcesoXTarjeta,
} from '../models';
import {OperarioXProcesoXTarjetaRepository} from '../repositories';

export class OperarioXProcesoXTarjetaProcesoXTarjetaController {
  constructor(
    @repository(OperarioXProcesoXTarjetaRepository)
    public operarioXProcesoXTarjetaRepository: OperarioXProcesoXTarjetaRepository,
  ) { }

  @get('/operario-x-proceso-x-tarjetas/{id}/proceso-x-tarjeta', {
    responses: {
      '200': {
        description: 'ProcesoXTarjeta belonging to OperarioXProcesoXTarjeta',
        content: {
          'application/json': {
            schema: getModelSchemaRef(ProcesoXTarjeta),
          },
        },
      },
    },
  })
  async getProcesoXTarjeta(
    @param.path.number('id') id: typeof OperarioXProcesoXTarjeta.prototype.id,
  ): Promise<ProcesoXTarjeta> {
    return this.operarioXProcesoXTarjetaRepository.procesoXTarjeta(id);
  }
}

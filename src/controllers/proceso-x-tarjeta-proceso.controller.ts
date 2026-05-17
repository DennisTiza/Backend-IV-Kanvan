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
  Proceso,
} from '../models';
import {ProcesoXTarjetaRepository} from '../repositories';

export class ProcesoXTarjetaProcesoController {
  constructor(
    @repository(ProcesoXTarjetaRepository)
    public procesoXTarjetaRepository: ProcesoXTarjetaRepository,
  ) { }

  @get('/proceso-x-tarjetas/{id}/proceso', {
    responses: {
      '200': {
        description: 'Proceso belonging to ProcesoXTarjeta',
        content: {
          'application/json': {
            schema: getModelSchemaRef(Proceso),
          },
        },
      },
    },
  })
  async getProceso(
    @param.path.number('id') id: typeof ProcesoXTarjeta.prototype.id,
  ): Promise<Proceso> {
    return this.procesoXTarjetaRepository.proceso(id);
  }
}

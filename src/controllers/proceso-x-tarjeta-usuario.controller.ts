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
  Usuario,
} from '../models';
import {ProcesoXTarjetaRepository} from '../repositories';

export class ProcesoXTarjetaUsuarioController {
  constructor(
    @repository(ProcesoXTarjetaRepository)
    public procesoXTarjetaRepository: ProcesoXTarjetaRepository,
  ) { }

  @get('/proceso-x-tarjetas/{id}/usuario', {
    responses: {
      '200': {
        description: 'Usuario belonging to ProcesoXTarjeta',
        content: {
          'application/json': {
            schema: getModelSchemaRef(Usuario),
          },
        },
      },
    },
  })
  async getUsuario(
    @param.path.number('id') id: typeof ProcesoXTarjeta.prototype.id,
  ): Promise<Usuario> {
    return this.procesoXTarjetaRepository.usuario(id);
  }
}

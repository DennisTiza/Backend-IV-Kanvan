import {
  Count,
  CountSchema,
  Filter,
  repository,
  Where,
} from '@loopback/repository';
import {
  del,
  get,
  getModelSchemaRef,
  getWhereSchemaFor,
  param,
  patch,
  post,
  requestBody,
} from '@loopback/rest';
import {
  ProcesoXTarjeta,
  OperarioXProcesoXTarjeta,
} from '../models';
import {ProcesoXTarjetaRepository} from '../repositories';

export class ProcesoXTarjetaOperarioXProcesoXTarjetaController {
  constructor(
    @repository(ProcesoXTarjetaRepository) protected procesoXTarjetaRepository: ProcesoXTarjetaRepository,
  ) { }

  @get('/proceso-x-tarjetas/{id}/operario-x-proceso-x-tarjetas', {
    responses: {
      '200': {
        description: 'Array of ProcesoXTarjeta has many OperarioXProcesoXTarjeta',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(OperarioXProcesoXTarjeta)},
          },
        },
      },
    },
  })
  async find(
    @param.path.number('id') id: number,
    @param.query.object('filter') filter?: Filter<OperarioXProcesoXTarjeta>,
  ): Promise<OperarioXProcesoXTarjeta[]> {
    return this.procesoXTarjetaRepository.operarioXProcesoXTarjetas(id).find(filter);
  }

  @post('/proceso-x-tarjetas/{id}/operario-x-proceso-x-tarjetas', {
    responses: {
      '200': {
        description: 'ProcesoXTarjeta model instance',
        content: {'application/json': {schema: getModelSchemaRef(OperarioXProcesoXTarjeta)}},
      },
    },
  })
  async create(
    @param.path.number('id') id: typeof ProcesoXTarjeta.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(OperarioXProcesoXTarjeta, {
            title: 'NewOperarioXProcesoXTarjetaInProcesoXTarjeta',
            exclude: ['id'],
            optional: ['procesoXTarjetaId']
          }),
        },
      },
    }) operarioXProcesoXTarjeta: Omit<OperarioXProcesoXTarjeta, 'id'>,
  ): Promise<OperarioXProcesoXTarjeta> {
    return this.procesoXTarjetaRepository.operarioXProcesoXTarjetas(id).create(operarioXProcesoXTarjeta);
  }

  @patch('/proceso-x-tarjetas/{id}/operario-x-proceso-x-tarjetas', {
    responses: {
      '200': {
        description: 'ProcesoXTarjeta.OperarioXProcesoXTarjeta PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(OperarioXProcesoXTarjeta, {partial: true}),
        },
      },
    })
    operarioXProcesoXTarjeta: Partial<OperarioXProcesoXTarjeta>,
    @param.query.object('where', getWhereSchemaFor(OperarioXProcesoXTarjeta)) where?: Where<OperarioXProcesoXTarjeta>,
  ): Promise<Count> {
    return this.procesoXTarjetaRepository.operarioXProcesoXTarjetas(id).patch(operarioXProcesoXTarjeta, where);
  }

  @del('/proceso-x-tarjetas/{id}/operario-x-proceso-x-tarjetas', {
    responses: {
      '200': {
        description: 'ProcesoXTarjeta.OperarioXProcesoXTarjeta DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.number('id') id: number,
    @param.query.object('where', getWhereSchemaFor(OperarioXProcesoXTarjeta)) where?: Where<OperarioXProcesoXTarjeta>,
  ): Promise<Count> {
    return this.procesoXTarjetaRepository.operarioXProcesoXTarjetas(id).delete(where);
  }
}

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
  Operario,
  OperarioXProcesoXTarjeta,
} from '../models';
import {OperarioRepository} from '../repositories';

export class OperarioOperarioXProcesoXTarjetaController {
  constructor(
    @repository(OperarioRepository) protected operarioRepository: OperarioRepository,
  ) { }

  @get('/operarios/{id}/operario-x-proceso-x-tarjetas', {
    responses: {
      '200': {
        description: 'Array of Operario has many OperarioXProcesoXTarjeta',
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
    return this.operarioRepository.operarioXProcesoXTarjetas(id).find(filter);
  }

  @post('/operarios/{id}/operario-x-proceso-x-tarjetas', {
    responses: {
      '200': {
        description: 'Operario model instance',
        content: {'application/json': {schema: getModelSchemaRef(OperarioXProcesoXTarjeta)}},
      },
    },
  })
  async create(
    @param.path.number('id') id: typeof Operario.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(OperarioXProcesoXTarjeta, {
            title: 'NewOperarioXProcesoXTarjetaInOperario',
            exclude: ['id'],
            optional: ['operarioId']
          }),
        },
      },
    }) operarioXProcesoXTarjeta: Omit<OperarioXProcesoXTarjeta, 'id'>,
  ): Promise<OperarioXProcesoXTarjeta> {
    return this.operarioRepository.operarioXProcesoXTarjetas(id).create(operarioXProcesoXTarjeta);
  }

  @patch('/operarios/{id}/operario-x-proceso-x-tarjetas', {
    responses: {
      '200': {
        description: 'Operario.OperarioXProcesoXTarjeta PATCH success count',
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
    return this.operarioRepository.operarioXProcesoXTarjetas(id).patch(operarioXProcesoXTarjeta, where);
  }

  @del('/operarios/{id}/operario-x-proceso-x-tarjetas', {
    responses: {
      '200': {
        description: 'Operario.OperarioXProcesoXTarjeta DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.number('id') id: number,
    @param.query.object('where', getWhereSchemaFor(OperarioXProcesoXTarjeta)) where?: Where<OperarioXProcesoXTarjeta>,
  ): Promise<Count> {
    return this.operarioRepository.operarioXProcesoXTarjetas(id).delete(where);
  }
}

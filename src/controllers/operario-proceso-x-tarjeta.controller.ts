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
  ProcesoXTarjeta,
} from '../models';
import {OperarioRepository} from '../repositories';

export class OperarioProcesoXTarjetaController {
  constructor(
    @repository(OperarioRepository) protected operarioRepository: OperarioRepository,
  ) { }

  @get('/operarios/{id}/proceso-x-tarjetas', {
    responses: {
      '200': {
        description: 'Array of Operario has many ProcesoXTarjeta',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(ProcesoXTarjeta)},
          },
        },
      },
    },
  })
  async find(
    @param.path.number('id') id: number,
    @param.query.object('filter') filter?: Filter<ProcesoXTarjeta>,
  ): Promise<ProcesoXTarjeta[]> {
    return this.operarioRepository.procesoXTarjetas(id).find(filter);
  }

  @post('/operarios/{id}/proceso-x-tarjetas', {
    responses: {
      '200': {
        description: 'Operario model instance',
        content: {'application/json': {schema: getModelSchemaRef(ProcesoXTarjeta)}},
      },
    },
  })
  async create(
    @param.path.number('id') id: typeof Operario.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(ProcesoXTarjeta, {
            title: 'NewProcesoXTarjetaInOperario',
            exclude: ['id'],
            optional: ['operarioId']
          }),
        },
      },
    }) procesoXTarjeta: Omit<ProcesoXTarjeta, 'id'>,
  ): Promise<ProcesoXTarjeta> {
    return this.operarioRepository.procesoXTarjetas(id).create(procesoXTarjeta);
  }

  @patch('/operarios/{id}/proceso-x-tarjetas', {
    responses: {
      '200': {
        description: 'Operario.ProcesoXTarjeta PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(ProcesoXTarjeta, {partial: true}),
        },
      },
    })
    procesoXTarjeta: Partial<ProcesoXTarjeta>,
    @param.query.object('where', getWhereSchemaFor(ProcesoXTarjeta)) where?: Where<ProcesoXTarjeta>,
  ): Promise<Count> {
    return this.operarioRepository.procesoXTarjetas(id).patch(procesoXTarjeta, where);
  }

  @del('/operarios/{id}/proceso-x-tarjetas', {
    responses: {
      '200': {
        description: 'Operario.ProcesoXTarjeta DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.number('id') id: number,
    @param.query.object('where', getWhereSchemaFor(ProcesoXTarjeta)) where?: Where<ProcesoXTarjeta>,
  ): Promise<Count> {
    return this.operarioRepository.procesoXTarjetas(id).delete(where);
  }
}

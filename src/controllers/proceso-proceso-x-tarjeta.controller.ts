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
  Proceso,
  ProcesoXTarjeta,
} from '../models';
import {ProcesoRepository} from '../repositories';

export class ProcesoProcesoXTarjetaController {
  constructor(
    @repository(ProcesoRepository) protected procesoRepository: ProcesoRepository,
  ) { }

  @get('/procesos/{id}/proceso-x-tarjetas', {
    responses: {
      '200': {
        description: 'Array of Proceso has many ProcesoXTarjeta',
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
    return this.procesoRepository.procesoXTarjetas(id).find(filter);
  }

  @post('/procesos/{id}/proceso-x-tarjetas', {
    responses: {
      '200': {
        description: 'Proceso model instance',
        content: {'application/json': {schema: getModelSchemaRef(ProcesoXTarjeta)}},
      },
    },
  })
  async create(
    @param.path.number('id') id: typeof Proceso.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(ProcesoXTarjeta, {
            title: 'NewProcesoXTarjetaInProceso',
            exclude: ['id'],
            optional: ['procesoId']
          }),
        },
      },
    }) procesoXTarjeta: Omit<ProcesoXTarjeta, 'id'>,
  ): Promise<ProcesoXTarjeta> {
    return this.procesoRepository.procesoXTarjetas(id).create(procesoXTarjeta);
  }

  @patch('/procesos/{id}/proceso-x-tarjetas', {
    responses: {
      '200': {
        description: 'Proceso.ProcesoXTarjeta PATCH success count',
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
    return this.procesoRepository.procesoXTarjetas(id).patch(procesoXTarjeta, where);
  }

  @del('/procesos/{id}/proceso-x-tarjetas', {
    responses: {
      '200': {
        description: 'Proceso.ProcesoXTarjeta DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.number('id') id: number,
    @param.query.object('where', getWhereSchemaFor(ProcesoXTarjeta)) where?: Where<ProcesoXTarjeta>,
  ): Promise<Count> {
    return this.procesoRepository.procesoXTarjetas(id).delete(where);
  }
}

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
  CodigoDeParada,
  ProcesoXTarjeta,
} from '../models';
import {CodigoDeParadaRepository} from '../repositories';

export class CodigoDeParadaProcesoXTarjetaController {
  constructor(
    @repository(CodigoDeParadaRepository) protected codigoDeParadaRepository: CodigoDeParadaRepository,
  ) { }

  @get('/codigo-de-paradas/{id}/proceso-x-tarjetas', {
    responses: {
      '200': {
        description: 'Array of CodigoDeParada has many ProcesoXTarjeta',
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
    return this.codigoDeParadaRepository.procesoXTarjetas(id).find(filter);
  }

  @post('/codigo-de-paradas/{id}/proceso-x-tarjetas', {
    responses: {
      '200': {
        description: 'CodigoDeParada model instance',
        content: {'application/json': {schema: getModelSchemaRef(ProcesoXTarjeta)}},
      },
    },
  })
  async create(
    @param.path.number('id') id: typeof CodigoDeParada.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(ProcesoXTarjeta, {
            title: 'NewProcesoXTarjetaInCodigoDeParada',
            exclude: ['id'],
            optional: ['codigoDeParadaId']
          }),
        },
      },
    }) procesoXTarjeta: Omit<ProcesoXTarjeta, 'id'>,
  ): Promise<ProcesoXTarjeta> {
    return this.codigoDeParadaRepository.procesoXTarjetas(id).create(procesoXTarjeta);
  }

  @patch('/codigo-de-paradas/{id}/proceso-x-tarjetas', {
    responses: {
      '200': {
        description: 'CodigoDeParada.ProcesoXTarjeta PATCH success count',
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
    return this.codigoDeParadaRepository.procesoXTarjetas(id).patch(procesoXTarjeta, where);
  }

  @del('/codigo-de-paradas/{id}/proceso-x-tarjetas', {
    responses: {
      '200': {
        description: 'CodigoDeParada.ProcesoXTarjeta DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.number('id') id: number,
    @param.query.object('where', getWhereSchemaFor(ProcesoXTarjeta)) where?: Where<ProcesoXTarjeta>,
  ): Promise<Count> {
    return this.codigoDeParadaRepository.procesoXTarjetas(id).delete(where);
  }
}

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
  Parada,
} from '../models';
import {CodigoDeParadaRepository} from '../repositories';

export class CodigoDeParadaParadaController {
  constructor(
    @repository(CodigoDeParadaRepository) protected codigoDeParadaRepository: CodigoDeParadaRepository,
  ) { }

  @get('/codigo-de-paradas/{id}/paradas', {
    responses: {
      '200': {
        description: 'Array of CodigoDeParada has many Parada',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Parada)},
          },
        },
      },
    },
  })
  async find(
    @param.path.number('id') id: number,
    @param.query.object('filter') filter?: Filter<Parada>,
  ): Promise<Parada[]> {
    return this.codigoDeParadaRepository.paradas(id).find(filter);
  }

  @post('/codigo-de-paradas/{id}/paradas', {
    responses: {
      '200': {
        description: 'CodigoDeParada model instance',
        content: {'application/json': {schema: getModelSchemaRef(Parada)}},
      },
    },
  })
  async create(
    @param.path.number('id') id: typeof CodigoDeParada.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Parada, {
            title: 'NewParadaInCodigoDeParada',
            exclude: ['id'],
            optional: ['codigoDeParadaId']
          }),
        },
      },
    }) parada: Omit<Parada, 'id'>,
  ): Promise<Parada> {
    return this.codigoDeParadaRepository.paradas(id).create(parada);
  }

  @patch('/codigo-de-paradas/{id}/paradas', {
    responses: {
      '200': {
        description: 'CodigoDeParada.Parada PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Parada, {partial: true}),
        },
      },
    })
    parada: Partial<Parada>,
    @param.query.object('where', getWhereSchemaFor(Parada)) where?: Where<Parada>,
  ): Promise<Count> {
    return this.codigoDeParadaRepository.paradas(id).patch(parada, where);
  }

  @del('/codigo-de-paradas/{id}/paradas', {
    responses: {
      '200': {
        description: 'CodigoDeParada.Parada DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.number('id') id: number,
    @param.query.object('where', getWhereSchemaFor(Parada)) where?: Where<Parada>,
  ): Promise<Count> {
    return this.codigoDeParadaRepository.paradas(id).delete(where);
  }
}

import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  repository,
  Where,
} from '@loopback/repository';
import {
  del,
  get,
  getModelSchemaRef,
  param,
  patch,
  post,
  put,
  requestBody,
  response,
} from '@loopback/rest';
import {CodigoDeParada} from '../models';
import {CodigoDeParadaRepository} from '../repositories';

export class CodigoDeParadaController {
  constructor(
    @repository(CodigoDeParadaRepository)
    public codigoDeParadaRepository: CodigoDeParadaRepository,
  ) { }

  @post('/codigo-de-parada')
  @response(200, {
    description: 'CodigoDeParada model instance',
    content: {'application/json': {schema: getModelSchemaRef(CodigoDeParada)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(CodigoDeParada, {
            title: 'NewCodigoDeParada',
            exclude: ['id'],
          }),
        },
      },
    })
    codigoDeParada: Omit<CodigoDeParada, 'id'>,
  ): Promise<CodigoDeParada> {
    return this.codigoDeParadaRepository.create(codigoDeParada);
  }

  @get('/codigo-de-parada/count')
  @response(200, {
    description: 'CodigoDeParada model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(CodigoDeParada) where?: Where<CodigoDeParada>,
  ): Promise<Count> {
    return this.codigoDeParadaRepository.count(where);
  }

  @get('/codigo-de-parada')
  @response(200, {
    description: 'Array of CodigoDeParada model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(CodigoDeParada, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(CodigoDeParada) filter?: Filter<CodigoDeParada>,
  ): Promise<CodigoDeParada[]> {
    return this.codigoDeParadaRepository.find(filter);
  }

  @patch('/codigo-de-parada')
  @response(200, {
    description: 'CodigoDeParada PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(CodigoDeParada, {partial: true}),
        },
      },
    })
    codigoDeParada: CodigoDeParada,
    @param.where(CodigoDeParada) where?: Where<CodigoDeParada>,
  ): Promise<Count> {
    return this.codigoDeParadaRepository.updateAll(codigoDeParada, where);
  }

  @get('/codigo-de-parada/{id}')
  @response(200, {
    description: 'CodigoDeParada model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(CodigoDeParada, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(CodigoDeParada, {exclude: 'where'}) filter?: FilterExcludingWhere<CodigoDeParada>
  ): Promise<CodigoDeParada> {
    return this.codigoDeParadaRepository.findById(id, filter);
  }

  @patch('/codigo-de-parada/{id}')
  @response(204, {
    description: 'CodigoDeParada PATCH success',
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(CodigoDeParada, {partial: true}),
        },
      },
    })
    codigoDeParada: CodigoDeParada,
  ): Promise<void> {
    await this.codigoDeParadaRepository.updateById(id, codigoDeParada);
  }

  @put('/codigo-de-parada/{id}')
  @response(204, {
    description: 'CodigoDeParada PUT success',
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() codigoDeParada: CodigoDeParada,
  ): Promise<void> {
    await this.codigoDeParadaRepository.replaceById(id, codigoDeParada);
  }

  @del('/codigo-de-parada/{id}')
  @response(204, {
    description: 'CodigoDeParada DELETE success',
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.codigoDeParadaRepository.deleteById(id);
  }
}

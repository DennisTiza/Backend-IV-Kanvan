import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  repository,
  Where,
} from '@loopback/repository';
import {
  post,
  param,
  get,
  getModelSchemaRef,
  patch,
  put,
  del,
  requestBody,
  response,
} from '@loopback/rest';
import {CodigoDeError} from '../models';
import {CodigoDeErrorRepository} from '../repositories';

export class CodigoDeErrorController {
  constructor(
    @repository(CodigoDeErrorRepository)
    public codigoDeErrorRepository : CodigoDeErrorRepository,
  ) {}

  @post('/codigo-de-error')
  @response(200, {
    description: 'CodigoDeError model instance',
    content: {'application/json': {schema: getModelSchemaRef(CodigoDeError)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(CodigoDeError, {
            title: 'NewCodigoDeError',
            exclude: ['id'],
          }),
        },
      },
    })
    codigoDeError: Omit<CodigoDeError, 'id'>,
  ): Promise<CodigoDeError> {
    return this.codigoDeErrorRepository.create(codigoDeError);
  }

  @get('/codigo-de-error/count')
  @response(200, {
    description: 'CodigoDeError model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(CodigoDeError) where?: Where<CodigoDeError>,
  ): Promise<Count> {
    return this.codigoDeErrorRepository.count(where);
  }

  @get('/codigo-de-error')
  @response(200, {
    description: 'Array of CodigoDeError model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(CodigoDeError, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(CodigoDeError) filter?: Filter<CodigoDeError>,
  ): Promise<CodigoDeError[]> {
    return this.codigoDeErrorRepository.find(filter);
  }

  @patch('/codigo-de-error')
  @response(200, {
    description: 'CodigoDeError PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(CodigoDeError, {partial: true}),
        },
      },
    })
    codigoDeError: CodigoDeError,
    @param.where(CodigoDeError) where?: Where<CodigoDeError>,
  ): Promise<Count> {
    return this.codigoDeErrorRepository.updateAll(codigoDeError, where);
  }

  @get('/codigo-de-error/{id}')
  @response(200, {
    description: 'CodigoDeError model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(CodigoDeError, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(CodigoDeError, {exclude: 'where'}) filter?: FilterExcludingWhere<CodigoDeError>
  ): Promise<CodigoDeError> {
    return this.codigoDeErrorRepository.findById(id, filter);
  }

  @patch('/codigo-de-error/{id}')
  @response(204, {
    description: 'CodigoDeError PATCH success',
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(CodigoDeError, {partial: true}),
        },
      },
    })
    codigoDeError: CodigoDeError,
  ): Promise<void> {
    await this.codigoDeErrorRepository.updateById(id, codigoDeError);
  }

  @put('/codigo-de-error/{id}')
  @response(204, {
    description: 'CodigoDeError PUT success',
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() codigoDeError: CodigoDeError,
  ): Promise<void> {
    await this.codigoDeErrorRepository.replaceById(id, codigoDeError);
  }

  @del('/codigo-de-error/{id}')
  @response(204, {
    description: 'CodigoDeError DELETE success',
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.codigoDeErrorRepository.deleteById(id);
  }
}

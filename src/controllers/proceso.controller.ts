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
import {Proceso} from '../models';
import {ProcesoRepository} from '../repositories';

export class ProcesoController {
  constructor(
    @repository(ProcesoRepository)
    public procesoRepository : ProcesoRepository,
  ) {}

  @post('/proceso')
  @response(200, {
    description: 'Proceso model instance',
    content: {'application/json': {schema: getModelSchemaRef(Proceso)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Proceso, {
            title: 'NewProceso',
            exclude: ['id'],
          }),
        },
      },
    })
    proceso: Omit<Proceso, 'id'>,
  ): Promise<Proceso> {
    return this.procesoRepository.create(proceso);
  }

  @get('/proceso/count')
  @response(200, {
    description: 'Proceso model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(Proceso) where?: Where<Proceso>,
  ): Promise<Count> {
    return this.procesoRepository.count(where);
  }

  @get('/proceso')
  @response(200, {
    description: 'Array of Proceso model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Proceso, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(Proceso) filter?: Filter<Proceso>,
  ): Promise<Proceso[]> {
    return this.procesoRepository.find(filter);
  }

  @patch('/proceso')
  @response(200, {
    description: 'Proceso PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Proceso, {partial: true}),
        },
      },
    })
    proceso: Proceso,
    @param.where(Proceso) where?: Where<Proceso>,
  ): Promise<Count> {
    return this.procesoRepository.updateAll(proceso, where);
  }

  @get('/proceso/{id}')
  @response(200, {
    description: 'Proceso model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Proceso, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(Proceso, {exclude: 'where'}) filter?: FilterExcludingWhere<Proceso>
  ): Promise<Proceso> {
    return this.procesoRepository.findById(id, filter);
  }

  @patch('/proceso/{id}')
  @response(204, {
    description: 'Proceso PATCH success',
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Proceso, {partial: true}),
        },
      },
    })
    proceso: Proceso,
  ): Promise<void> {
    await this.procesoRepository.updateById(id, proceso);
  }

  @put('/proceso/{id}')
  @response(204, {
    description: 'Proceso PUT success',
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() proceso: Proceso,
  ): Promise<void> {
    await this.procesoRepository.replaceById(id, proceso);
  }

  @del('/proceso/{id}')
  @response(204, {
    description: 'Proceso DELETE success',
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.procesoRepository.deleteById(id);
  }
}

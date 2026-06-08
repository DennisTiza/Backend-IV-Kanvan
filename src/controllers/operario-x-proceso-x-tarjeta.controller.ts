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
import {OperarioXProcesoXTarjeta} from '../models';
import {OperarioXProcesoXTarjetaRepository} from '../repositories';

export class OperarioXProcesoXTarjetaController {
  constructor(
    @repository(OperarioXProcesoXTarjetaRepository)
    public operarioXProcesoXTarjetaRepository: OperarioXProcesoXTarjetaRepository,
  ) { }

  @post('/operario-x-proceso-x-tarjetas')
  @response(200, {
    description: 'OperarioXProcesoXTarjeta model instance',
    content: {'application/json': {schema: getModelSchemaRef(OperarioXProcesoXTarjeta)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(OperarioXProcesoXTarjeta, {
            title: 'NewOperarioXProcesoXTarjeta',
            exclude: ['id'],
          }),
        },
      },
    })
    operarioXProcesoXTarjeta: Omit<OperarioXProcesoXTarjeta, 'id'>,
  ): Promise<OperarioXProcesoXTarjeta> {
    return this.operarioXProcesoXTarjetaRepository.create(operarioXProcesoXTarjeta);
  }

  @get('/operario-x-proceso-x-tarjetas/count')
  @response(200, {
    description: 'OperarioXProcesoXTarjeta model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(OperarioXProcesoXTarjeta) where?: Where<OperarioXProcesoXTarjeta>,
  ): Promise<Count> {
    return this.operarioXProcesoXTarjetaRepository.count(where);
  }

  @get('/operario-x-proceso-x-tarjetas')
  @response(200, {
    description: 'Array of OperarioXProcesoXTarjeta model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(OperarioXProcesoXTarjeta, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(OperarioXProcesoXTarjeta) filter?: Filter<OperarioXProcesoXTarjeta>,
  ): Promise<OperarioXProcesoXTarjeta[]> {
    return this.operarioXProcesoXTarjetaRepository.find(filter);
  }



  @patch('/operario-x-proceso-x-tarjetas')
  @response(200, {
    description: 'OperarioXProcesoXTarjeta PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(OperarioXProcesoXTarjeta, {partial: true}),
        },
      },
    })
    operarioXProcesoXTarjeta: OperarioXProcesoXTarjeta,
    @param.where(OperarioXProcesoXTarjeta) where?: Where<OperarioXProcesoXTarjeta>,
  ): Promise<Count> {
    return this.operarioXProcesoXTarjetaRepository.updateAll(operarioXProcesoXTarjeta, where);
  }

  @get('/operario-x-proceso-x-tarjetas/{id}')
  @response(200, {
    description: 'OperarioXProcesoXTarjeta model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(OperarioXProcesoXTarjeta, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(OperarioXProcesoXTarjeta, {exclude: 'where'}) filter?: FilterExcludingWhere<OperarioXProcesoXTarjeta>
  ): Promise<OperarioXProcesoXTarjeta> {
    return this.operarioXProcesoXTarjetaRepository.findById(id, filter);
  }

  @get('/operario-x-proceso-x-tarjetas/proceso-x-tarjeta/{procesoXTarjetaId}')
  @response(200, {
    description: 'Lista de OperarioXProcesoXTarjeta por ProcesoXTarjeta',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(OperarioXProcesoXTarjeta, {
            includeRelations: true,
          }),
        },
      },
    },
  })
  async findByProcesoXTarjeta(
    @param.path.number('procesoXTarjetaId') procesoXTarjetaId: number,
  ): Promise<OperarioXProcesoXTarjeta[]> {
    return this.operarioXProcesoXTarjetaRepository.find({
      where: {
        procesoXTarjetaId: procesoXTarjetaId,
      },
    });
  }

  @patch('/operario-x-proceso-x-tarjetas/{id}')
  @response(204, {
    description: 'OperarioXProcesoXTarjeta PATCH success',
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(OperarioXProcesoXTarjeta, {partial: true}),
        },
      },
    })
    operarioXProcesoXTarjeta: OperarioXProcesoXTarjeta,
  ): Promise<void> {
    await this.operarioXProcesoXTarjetaRepository.updateById(id, operarioXProcesoXTarjeta);
  }

  @put('/operario-x-proceso-x-tarjetas/{id}')
  @response(204, {
    description: 'OperarioXProcesoXTarjeta PUT success',
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() operarioXProcesoXTarjeta: OperarioXProcesoXTarjeta,
  ): Promise<void> {
    await this.operarioXProcesoXTarjetaRepository.replaceById(id, operarioXProcesoXTarjeta);
  }

  @del('/operario-x-proceso-x-tarjetas/{id}')
  @response(204, {
    description: 'OperarioXProcesoXTarjeta DELETE success',
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.operarioXProcesoXTarjetaRepository.deleteById(id);
  }
}

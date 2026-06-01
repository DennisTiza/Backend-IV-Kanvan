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
import {ProcesoXTarjeta} from '../models';
import {ProcesoXTarjetaRepository} from '../repositories';

export class ProcesoXTarjetaController {
  constructor(
    @repository(ProcesoXTarjetaRepository)
    public procesoXTarjetaRepository: ProcesoXTarjetaRepository,
  ) { }

  @post('/proceso-x-tarjeta')
  @response(200, {
    description: 'ProcesoXTarjeta model instance',
    content: {'application/json': {schema: getModelSchemaRef(ProcesoXTarjeta)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(ProcesoXTarjeta, {
            title: 'NewProcesoXTarjeta',
            exclude: ['id'],
          }),
        },
      },
    })
    procesoXTarjeta: Omit<ProcesoXTarjeta, 'id'>,
  ): Promise<ProcesoXTarjeta> {
    return this.procesoXTarjetaRepository.create(procesoXTarjeta);
  }

  @get('/proceso-x-tarjeta/count')
  @response(200, {
    description: 'ProcesoXTarjeta model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(ProcesoXTarjeta) where?: Where<ProcesoXTarjeta>,
  ): Promise<Count> {
    return this.procesoXTarjetaRepository.count(where);
  }

  @get('/proceso-x-tarjeta')
  @response(200, {
    description: 'Array of ProcesoXTarjeta model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(ProcesoXTarjeta, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(ProcesoXTarjeta) filter?: Filter<ProcesoXTarjeta>,
  ): Promise<ProcesoXTarjeta[]> {
    return this.procesoXTarjetaRepository.find(filter);
  }

  @patch('/proceso-x-tarjeta')
  @response(200, {
    description: 'ProcesoXTarjeta PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(ProcesoXTarjeta, {partial: true}),
        },
      },
    })
    procesoXTarjeta: ProcesoXTarjeta,
    @param.where(ProcesoXTarjeta) where?: Where<ProcesoXTarjeta>,
  ): Promise<Count> {
    return this.procesoXTarjetaRepository.updateAll(procesoXTarjeta, where);
  }

  @get('/proceso-x-tarjeta/por-tarjeta/{tarjetaId}')
  @response(200, {
    description: 'Procesos por tarjeta',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(ProcesoXTarjeta),
        },
      },
    },
  })
  async getProcesosPorTarjeta(
    @param.path.number('tarjetaId') tarjetaId: number,
  ): Promise<ProcesoXTarjeta[]> {
    return this.procesoXTarjetaRepository.find({
      where: {
        tarjetaDeProduccionId: tarjetaId,
      },
    });
  }

  @get('/proceso-x-tarjeta/{id}')
  @response(200, {
    description: 'ProcesoXTarjeta model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(ProcesoXTarjeta, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(ProcesoXTarjeta, {exclude: 'where'}) filter?: FilterExcludingWhere<ProcesoXTarjeta>
  ): Promise<ProcesoXTarjeta> {
    return this.procesoXTarjetaRepository.findById(id, filter);
  }

  @patch('/proceso-x-tarjeta/{id}')
  @response(204, {
    description: 'ProcesoXTarjeta PATCH success',
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(ProcesoXTarjeta, {partial: true}),
        },
      },
    })
    procesoXTarjeta: ProcesoXTarjeta,
  ): Promise<void> {
    await this.procesoXTarjetaRepository.updateById(id, procesoXTarjeta);
  }

  @put('/proceso-x-tarjeta/{id}')
  @response(204, {
    description: 'ProcesoXTarjeta PUT success',
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() procesoXTarjeta: ProcesoXTarjeta,
  ): Promise<void> {
    await this.procesoXTarjetaRepository.replaceById(id, procesoXTarjeta);
  }

  @del('/proceso-x-tarjeta/{id}')
  @response(204, {
    description: 'ProcesoXTarjeta DELETE success',
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.procesoXTarjetaRepository.deleteById(id);
  }
}

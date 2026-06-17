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
  Parada,
  ProcesoXTarjeta,
} from '../models';
import {ProcesoXTarjetaRepository} from '../repositories';

export class ProcesoXTarjetaParadaController {
  constructor(
    @repository(ProcesoXTarjetaRepository) protected procesoXTarjetaRepository: ProcesoXTarjetaRepository,
  ) { }

  @get('/proceso-x-tarjetas/{id}/paradas', {
    responses: {
      '200': {
        description: 'Array of ProcesoXTarjeta has many Parada',
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
    return this.procesoXTarjetaRepository.paradas(id).find(filter);
  }

  @post('/proceso-x-tarjetas/{id}/paradas', {
    responses: {
      '200': {
        description: 'ProcesoXTarjeta model instance',
        content: {'application/json': {schema: getModelSchemaRef(Parada)}},
      },
    },
  })
  async create(
    @param.path.number('id') id: typeof ProcesoXTarjeta.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Parada, {
            title: 'NewParadaInProcesoXTarjeta',
            exclude: ['id'],
            optional: ['procesoXTarjetaId']
          }),
        },
      },
    }) parada: Omit<Parada, 'id'>,
  ): Promise<Parada> {
    return this.procesoXTarjetaRepository.paradas(id).create(parada);
  }

  @patch('/proceso-x-tarjetas/{id}/paradas', {
    responses: {
      '200': {
        description: 'ProcesoXTarjeta.Parada PATCH success count',
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
    return this.procesoXTarjetaRepository.paradas(id).patch(parada, where);
  }

  @del('/proceso-x-tarjetas/{id}/paradas', {
    responses: {
      '200': {
        description: 'ProcesoXTarjeta.Parada DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.number('id') id: number,
    @param.query.object('where', getWhereSchemaFor(Parada)) where?: Where<Parada>,
  ): Promise<Count> {
    return this.procesoXTarjetaRepository.paradas(id).delete(where);
  }
}

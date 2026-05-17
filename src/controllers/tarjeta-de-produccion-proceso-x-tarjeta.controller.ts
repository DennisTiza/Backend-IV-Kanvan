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
  TarjetaDeProduccion,
  ProcesoXTarjeta,
} from '../models';
import {TarjetaDeProduccionRepository} from '../repositories';

export class TarjetaDeProduccionProcesoXTarjetaController {
  constructor(
    @repository(TarjetaDeProduccionRepository) protected tarjetaDeProduccionRepository: TarjetaDeProduccionRepository,
  ) { }

  @get('/tarjeta-de-produccions/{id}/proceso-x-tarjetas', {
    responses: {
      '200': {
        description: 'Array of TarjetaDeProduccion has many ProcesoXTarjeta',
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
    return this.tarjetaDeProduccionRepository.procesoXTarjetas(id).find(filter);
  }

  @post('/tarjeta-de-produccions/{id}/proceso-x-tarjetas', {
    responses: {
      '200': {
        description: 'TarjetaDeProduccion model instance',
        content: {'application/json': {schema: getModelSchemaRef(ProcesoXTarjeta)}},
      },
    },
  })
  async create(
    @param.path.number('id') id: typeof TarjetaDeProduccion.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(ProcesoXTarjeta, {
            title: 'NewProcesoXTarjetaInTarjetaDeProduccion',
            exclude: ['id'],
            optional: ['tarjetaDeProduccionId']
          }),
        },
      },
    }) procesoXTarjeta: Omit<ProcesoXTarjeta, 'id'>,
  ): Promise<ProcesoXTarjeta> {
    return this.tarjetaDeProduccionRepository.procesoXTarjetas(id).create(procesoXTarjeta);
  }

  @patch('/tarjeta-de-produccions/{id}/proceso-x-tarjetas', {
    responses: {
      '200': {
        description: 'TarjetaDeProduccion.ProcesoXTarjeta PATCH success count',
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
    return this.tarjetaDeProduccionRepository.procesoXTarjetas(id).patch(procesoXTarjeta, where);
  }

  @del('/tarjeta-de-produccions/{id}/proceso-x-tarjetas', {
    responses: {
      '200': {
        description: 'TarjetaDeProduccion.ProcesoXTarjeta DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.number('id') id: number,
    @param.query.object('where', getWhereSchemaFor(ProcesoXTarjeta)) where?: Where<ProcesoXTarjeta>,
  ): Promise<Count> {
    return this.tarjetaDeProduccionRepository.procesoXTarjetas(id).delete(where);
  }
}

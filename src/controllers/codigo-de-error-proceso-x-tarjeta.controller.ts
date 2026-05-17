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
  CodigoDeError,
  ProcesoXTarjeta,
} from '../models';
import {CodigoDeErrorRepository} from '../repositories';

export class CodigoDeErrorProcesoXTarjetaController {
  constructor(
    @repository(CodigoDeErrorRepository) protected codigoDeErrorRepository: CodigoDeErrorRepository,
  ) { }

  @get('/codigo-de-errors/{id}/proceso-x-tarjetas', {
    responses: {
      '200': {
        description: 'Array of CodigoDeError has many ProcesoXTarjeta',
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
    return this.codigoDeErrorRepository.procesoXTarjetas(id).find(filter);
  }

  @post('/codigo-de-errors/{id}/proceso-x-tarjetas', {
    responses: {
      '200': {
        description: 'CodigoDeError model instance',
        content: {'application/json': {schema: getModelSchemaRef(ProcesoXTarjeta)}},
      },
    },
  })
  async create(
    @param.path.number('id') id: typeof CodigoDeError.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(ProcesoXTarjeta, {
            title: 'NewProcesoXTarjetaInCodigoDeError',
            exclude: ['id'],
            optional: ['codigoDeErrorId']
          }),
        },
      },
    }) procesoXTarjeta: Omit<ProcesoXTarjeta, 'id'>,
  ): Promise<ProcesoXTarjeta> {
    return this.codigoDeErrorRepository.procesoXTarjetas(id).create(procesoXTarjeta);
  }

  @patch('/codigo-de-errors/{id}/proceso-x-tarjetas', {
    responses: {
      '200': {
        description: 'CodigoDeError.ProcesoXTarjeta PATCH success count',
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
    return this.codigoDeErrorRepository.procesoXTarjetas(id).patch(procesoXTarjeta, where);
  }

  @del('/codigo-de-errors/{id}/proceso-x-tarjetas', {
    responses: {
      '200': {
        description: 'CodigoDeError.ProcesoXTarjeta DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.number('id') id: number,
    @param.query.object('where', getWhereSchemaFor(ProcesoXTarjeta)) where?: Where<ProcesoXTarjeta>,
  ): Promise<Count> {
    return this.codigoDeErrorRepository.procesoXTarjetas(id).delete(where);
  }
}

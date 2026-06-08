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
import {TarjetaDeProduccion} from '../models';
import {ProcesoXTarjetaRepository, ProductoXProcesoRepository, TarjetaDeProduccionRepository} from '../repositories';

export class TarjetaDeProduccionController {
  constructor(
    @repository(TarjetaDeProduccionRepository)
    public tarjetaDeProduccionRepository: TarjetaDeProduccionRepository,
    @repository(ProductoXProcesoRepository)
    public productoXProcesoRepository: ProductoXProcesoRepository,
    @repository(ProcesoXTarjetaRepository)
    public procesoXTarjetaRepository: ProcesoXTarjetaRepository,
  ) { }

  @post('/tarjeta-de-produccion')
  @response(200, {
    description: 'TarjetaDeProduccion model instance',
    content: {'application/json': {schema: getModelSchemaRef(TarjetaDeProduccion)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(TarjetaDeProduccion, {
            title: 'NewTarjetaDeProduccion',
            exclude: ['id', 'estado'],
          }),
        },
      },
    })
    tarjetaDeProduccion: Omit<TarjetaDeProduccion, 'id'>,
  ): Promise<TarjetaDeProduccion> {

    // Ignora cualquier estado que envíe el cliente
    tarjetaDeProduccion.estado = 'por_hacer';

    const tarjeta = await this.tarjetaDeProduccionRepository.create(
      tarjetaDeProduccion,
    );

    if (tarjeta.productoId) {
      const procesosDeProducto = await this.productoXProcesoRepository.find({
        where: {productoId: tarjeta.productoId},
        order: ['orden ASC'],
      });
    }

    console.log('Tarjeta de producción creada con ID:', tarjeta);
    return tarjeta;
  }

  @get('/tarjeta-de-produccion/count')
  @response(200, {
    description: 'TarjetaDeProduccion model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(TarjetaDeProduccion) where?: Where<TarjetaDeProduccion>,
  ): Promise<Count> {
    return this.tarjetaDeProduccionRepository.count(where);
  }

  @get('/tarjeta-de-produccion')
  @response(200, {
    description: 'Array of TarjetaDeProduccion model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(TarjetaDeProduccion, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(TarjetaDeProduccion) filter?: Filter<TarjetaDeProduccion>,
  ): Promise<TarjetaDeProduccion[]> {
    return this.tarjetaDeProduccionRepository.find(filter);
  }

  @patch('/tarjeta-de-produccion')
  @response(200, {
    description: 'TarjetaDeProduccion PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(TarjetaDeProduccion, {partial: true}),
        },
      },
    })
    tarjetaDeProduccion: TarjetaDeProduccion,
    @param.where(TarjetaDeProduccion) where?: Where<TarjetaDeProduccion>,
  ): Promise<Count> {
    return this.tarjetaDeProduccionRepository.updateAll(tarjetaDeProduccion, where);
  }

  @get('/tarjeta-de-produccion/{id}')
  @response(200, {
    description: 'TarjetaDeProduccion model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(TarjetaDeProduccion, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(TarjetaDeProduccion, {exclude: 'where'}) filter?: FilterExcludingWhere<TarjetaDeProduccion>
  ): Promise<TarjetaDeProduccion> {
    return this.tarjetaDeProduccionRepository.findById(id, filter);
  }

  @patch('/tarjeta-de-produccion/{id}')
  @response(204, {
    description: 'TarjetaDeProduccion PATCH success',
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(TarjetaDeProduccion, {partial: true}),
        },
      },
    })
    tarjetaDeProduccion: TarjetaDeProduccion,
  ): Promise<void> {
    await this.tarjetaDeProduccionRepository.updateById(id, tarjetaDeProduccion);
  }

  @put('/tarjeta-de-produccion/{id}')
  @response(204, {
    description: 'TarjetaDeProduccion PUT success',
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() tarjetaDeProduccion: TarjetaDeProduccion,
  ): Promise<void> {
    await this.tarjetaDeProduccionRepository.replaceById(id, tarjetaDeProduccion);
  }

  @del('/tarjeta-de-produccion/{id}')
  @response(204, {
    description: 'TarjetaDeProduccion DELETE success',
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.tarjetaDeProduccionRepository.deleteById(id);
  }
}

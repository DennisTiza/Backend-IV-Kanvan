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
  HttpErrors,
  param,
  patch,
  post,
  put,
  requestBody,
  response,
} from '@loopback/rest';
import {ProcesoOperarios, ProcesoXTarjeta} from '../models';
import {OperarioXProcesoXTarjetaRepository, ProcesoXTarjetaRepository, TarjetaDeProduccionRepository} from '../repositories';

export class ProcesoXTarjetaController {
  constructor(
    @repository(ProcesoXTarjetaRepository)
    public procesoXTarjetaRepository: ProcesoXTarjetaRepository,
    @repository(TarjetaDeProduccionRepository)
    public tarjetaDeProduccionRepository: TarjetaDeProduccionRepository,
    @repository(OperarioXProcesoXTarjetaRepository)
    public operarioXProcesoXTarjetaRepository: OperarioXProcesoXTarjetaRepository,
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
          schema: getModelSchemaRef(ProcesoOperarios, {
            title: 'NewProcesoOperarios',
            exclude: ['id'],
          }),
        },
      },
    })
    body: Omit<ProcesoOperarios, 'id'>,
  ): Promise<ProcesoXTarjeta> {
    const {operariosIds, ...procesoXTarjeta} = body;
    const nuevoProceso = await this.procesoXTarjetaRepository.create(procesoXTarjeta);

    if (operariosIds && operariosIds.length > 0) {
      for (const operarioId of operariosIds) {
        await this.operarioXProcesoXTarjetaRepository.create({
          operarioId,
          procesoXTarjetaId: nuevoProceso.id,
        });
      }
    }
    return nuevoProceso;
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
      order: ['orden ASC'],
    });
  }

  @post('/proceso-x-tarjeta/{id}/iniciar')
  @response(200, {
    description: 'ProcesoXTarjeta iniciado',
    content: {'application/json': {schema: getModelSchemaRef(ProcesoXTarjeta)}},
  })
  async iniciar(
    @param.path.number('id') id: number,
  ): Promise<ProcesoXTarjeta> {
    const proceso = await this.procesoXTarjetaRepository.findById(id);
    if (!proceso) {
      throw new HttpErrors.NotFound('Proceso no encontrado');
    }
    if (proceso.fechaInicio) {
      throw new HttpErrors.Conflict('El proceso ya fue iniciado');
    }

    const hermanos = await this.procesoXTarjetaRepository.find({
      where: {tarjetaDeProduccionId: proceso.tarjetaDeProduccionId},
      order: ['orden ASC'],
    });
    const idx = hermanos.findIndex(p => p.id === id);
    if (idx > 0) {
      const anterior = hermanos[idx - 1];
      if (!anterior.fechaFinal) {
        throw new HttpErrors.Conflict(
          'El proceso anterior no ha finalizado',
        );
      }
    }

    proceso.fechaInicio = new Date().toISOString().replace('T', ' ').replace('Z', '');
    await this.procesoXTarjetaRepository.updateById(id, {
      fechaInicio: proceso.fechaInicio,
    });

    if (idx === 0) {
      await this.tarjetaDeProduccionRepository.updateById(
        proceso.tarjetaDeProduccionId,
        {estado: 'en_proceso'},
      );
    }

    return this.procesoXTarjetaRepository.findById(id);
  }

  @post('/proceso-x-tarjeta/{id}/finalizar')
  @response(200, {
    description: 'ProcesoXTarjeta finalizado',
    content: {'application/json': {schema: getModelSchemaRef(ProcesoXTarjeta)}},
  })
  async finalizar(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              codigoDeErrorId: {type: 'number'},
            },
          },
        },
      },
    })
    body: {codigoDeErrorId?: number},
  ): Promise<ProcesoXTarjeta> {
    const proceso = await this.procesoXTarjetaRepository.findById(id);
    if (!proceso) {
      throw new HttpErrors.NotFound('Proceso no encontrado');
    }
    if (!proceso.fechaInicio) {
      throw new HttpErrors.Conflict('El proceso no ha sido iniciado');
    }
    if (proceso.fechaFinal) {
      throw new HttpErrors.Conflict('El proceso ya fue finalizado');
    }

    const updateData: Partial<ProcesoXTarjeta> = {
      fechaFinal: new Date().toISOString().replace('T', ' ').replace('Z', ''),
    };
    if (body.codigoDeErrorId != null) {
      updateData.codigoDeErrorId = body.codigoDeErrorId;
    }

    await this.procesoXTarjetaRepository.updateById(id, updateData);

    const todos = await this.procesoXTarjetaRepository.find({
      where: {tarjetaDeProduccionId: proceso.tarjetaDeProduccionId},
    });
    const todosFinalizados = todos.every(p => p.fechaFinal);
    if (todosFinalizados) {
      await this.tarjetaDeProduccionRepository.updateById(
        proceso.tarjetaDeProduccionId,
        {estado: 'finalizada'},
      );
    }

    return this.procesoXTarjetaRepository.findById(id);
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
          schema: getModelSchemaRef(ProcesoOperarios, {partial: true}),
        },
      },
    })
    body: Partial<ProcesoOperarios>,
  ): Promise<void> {
    const {operariosIds, ...procesoXTarjeta} = body;
    await this.procesoXTarjetaRepository.updateById(id, procesoXTarjeta);

    if (operariosIds !== undefined) {
      await this.operarioXProcesoXTarjetaRepository.deleteAll({procesoXTarjetaId: id});
      if (operariosIds.length > 0) {
        for (const operarioId of operariosIds) {
          await this.operarioXProcesoXTarjetaRepository.create({
            operarioId,
            procesoXTarjetaId: id,
          });
        }
      }
    }
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

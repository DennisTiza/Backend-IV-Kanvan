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
import {Parada, ProcesoOperarios, ProcesoXTarjeta} from '../models';
import {OperarioXProcesoXTarjetaRepository, ParadaRepository, ProcesoXTarjetaRepository, TarjetaDeProduccionRepository} from '../repositories';

export class ProcesoXTarjetaController {
  constructor(
    @repository(ProcesoXTarjetaRepository)
    public procesoXTarjetaRepository: ProcesoXTarjetaRepository,
    @repository(TarjetaDeProduccionRepository)
    public tarjetaDeProduccionRepository: TarjetaDeProduccionRepository,
    @repository(OperarioXProcesoXTarjetaRepository)
    public operarioXProcesoXTarjetaRepository: OperarioXProcesoXTarjetaRepository,
    @repository(ParadaRepository)
    public paradaRepository: ParadaRepository,
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

    if (procesoXTarjeta.cantidad == null && procesoXTarjeta.tarjetaDeProduccionId) {
      const tarjeta = await this.tarjetaDeProduccionRepository.findById(
        procesoXTarjeta.tarjetaDeProduccionId
      );
      procesoXTarjeta.cantidad = tarjeta.cantidad;
    }

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
    if (proceso.cantidadRegistrada === proceso.cantidad) {
      throw new HttpErrors.Conflict('El proceso ya está completo');
    }

    const ahora = new Date().toISOString().replace('T', ' ').replace('Z', '');
    await this.procesoXTarjetaRepository.updateById(id, {
      fechaInicio: ahora,
    });

    if (proceso.orden === 1) {
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
              cantidadReportada: {type: 'number'},
            },
          },
        },
      },
      required: false,
    })
    body?: {cantidadReportada?: number},
  ): Promise<ProcesoXTarjeta> {
    const proceso = await this.procesoXTarjetaRepository.findById(id);
    if (!proceso) {
      throw new HttpErrors.NotFound('Proceso no encontrado');
    }
    if (!proceso.fechaInicio && (!proceso.cantidadRegistrada || proceso.cantidadRegistrada <= 0)) {
      throw new HttpErrors.Conflict('El proceso no ha sido iniciado');
    }
    if (proceso.fechaFinal) {
      throw new HttpErrors.Conflict('El proceso ya fue finalizado');
    }

    const ahora = new Date();
    const ahoraStr = ahora.toISOString().replace('T', ' ').replace('Z', '');
    const updateData: {fechaFinal: string; cantidadRealizada?: number; cantidadRegistrada?: number; tiempoConsumido?: number} = {
      fechaFinal: ahoraStr,
    };

    if (body?.cantidadReportada !== undefined) {
      const nuevaCantidadRegistrada = (proceso.cantidadRegistrada || 0) + body.cantidadReportada;
      if (nuevaCantidadRegistrada > proceso.cantidad) {
        throw new HttpErrors.UnprocessableEntity(
          'La cantidad reportada supera la cantidad total del proceso',
        );
      }
      updateData.cantidadRealizada = body.cantidadReportada;
      updateData.cantidadRegistrada = nuevaCantidadRegistrada;

      if (proceso.fechaInicio) {
        const duracionSesion = Math.floor(
          (ahora.getTime() - new Date(proceso.fechaInicio).getTime()) / 1000,
        );
        updateData.tiempoConsumido = (proceso.tiempoConsumido || 0) + duracionSesion;
      }
    }

    await this.procesoXTarjetaRepository.updateById(id, updateData);

    const todos = await this.procesoXTarjetaRepository.find({
      where: {tarjetaDeProduccionId: proceso.tarjetaDeProduccionId},
    });
    const todosCompletos = todos.every(
      p => p.cantidadRegistrada === p.cantidad
    );
    if (todosCompletos) {
      await this.tarjetaDeProduccionRepository.updateById(
        proceso.tarjetaDeProduccionId,
        {estado: 'finalizada'},
      );
    }

    return this.procesoXTarjetaRepository.findById(id);
  }

  @post('/proceso-x-tarjeta/{id}/registrar-parada')
  @response(200, {
    description: 'Parada registrada',
    content: {'application/json': {schema: getModelSchemaRef(ProcesoXTarjeta)}},
  })
  async registrarParada(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              cantidadReportada: {type: 'number'},
              codigoDeParadaId: {type: 'number'},
            },
            required: ['cantidadReportada', 'codigoDeParadaId'],
          },
        },
      },
    })
    body: {cantidadReportada: number; codigoDeParadaId: number},
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

    const nuevaCantidadRegistrada = (proceso.cantidadRegistrada || 0) + body.cantidadReportada;
    if (nuevaCantidadRegistrada > proceso.cantidad) {
      throw new HttpErrors.UnprocessableEntity(
        'La cantidad reportada supera la cantidad total del proceso',
      );
    }

    const ahora = new Date();
    const ahoraStr = ahora.toISOString().replace('T', ' ').replace('Z', '');

    await this.paradaRepository.create({
      procesoXTarjetaId: id,
      codigoDeParadaId: body.codigoDeParadaId,
      cantidadReportada: body.cantidadReportada,
      fecha: ahoraStr,
    });

    const duracionSesion = Math.floor(
      (ahora.getTime() - new Date(proceso.fechaInicio!).getTime()) / 1000,
    );

    const updateData: Record<string, string | number | null> = {
      cantidadRealizada: body.cantidadReportada,
      cantidadRegistrada: nuevaCantidadRegistrada,
      tiempoConsumido: (proceso.tiempoConsumido || 0) + duracionSesion,
      fechaInicio: null,
    };

    if (nuevaCantidadRegistrada >= proceso.cantidad) {
      updateData.fechaFinal = ahoraStr;
    }

    await this.procesoXTarjetaRepository.updateById(id, updateData);

    return this.procesoXTarjetaRepository.findById(id);
  }

  @get('/proceso-x-tarjeta/{id}/paradas')
  @response(200, {
    description: 'Array de Parada del proceso',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Parada),
        },
      },
    },
  })
  async getParadas(
    @param.path.number('id') id: number,
  ): Promise<Parada[]> {
    return this.paradaRepository.find({
      where: {procesoXTarjetaId: id},
      order: ['fecha ASC'],
      include: ['codigoDeParada'],
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

import {belongsTo, Entity, hasMany, model, property} from '@loopback/repository';
import {OperarioXProcesoXTarjeta} from './operario-x-proceso-x-tarjeta.model';
import {Parada} from './parada.model';
import {Proceso} from './proceso.model';
import {TarjetaDeProduccion} from './tarjeta-de-produccion.model';

@model()
export class ProcesoXTarjeta extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  id?: number;

  @property({
    type: 'string',
    mysql: {
      dataType: 'datetime',
    },
  })
  fechaInicio?: string;

  @property({
    type: 'string',
    mysql: {
      dataType: 'datetime',
    },
  })
  fechaFinal: string;

  @property({
    type: 'number',
  })
  tiempo: number;

  @property({
    type: 'number',
  })
  tiempoConsumido: number;

  @property({
    type: 'number',
    required: true,
  })
  orden: number;

  @property({
    type: 'number',
    required: true,
  })
  cantidad: number;

  @property({
    type: 'number',
  })
  cantidadRealizada: number;

  @property({
    type: 'number',
  })
  cantidadRegistrada: number;

  @belongsTo(() => Proceso)
  procesoId: number;

  @belongsTo(() => TarjetaDeProduccion)
  tarjetaDeProduccionId: number;

  @hasMany(() => OperarioXProcesoXTarjeta)
  operarioXProcesoXTarjetas: OperarioXProcesoXTarjeta[];

  @hasMany(() => Parada)
  paradas: Parada[];

  constructor(data?: Partial<ProcesoXTarjeta>) {
    super(data);
  }
}

export interface ProcesoXTarjetaRelations {
  // describe navigational properties here
}

export type ProcesoXTarjetaWithRelations = ProcesoXTarjeta & ProcesoXTarjetaRelations;

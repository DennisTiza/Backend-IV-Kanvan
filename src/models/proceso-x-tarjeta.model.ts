import {belongsTo, Entity, hasMany, model, property} from '@loopback/repository';
import {CodigoDeParada} from './codigo-de-parada.model';
import {OperarioXProcesoXTarjeta} from './operario-x-proceso-x-tarjeta.model';
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
    required: true,
  })
  orden: number;

  @belongsTo(() => Proceso)
  procesoId: number;

  @belongsTo(() => TarjetaDeProduccion)
  tarjetaDeProduccionId: number;

  @belongsTo(() => CodigoDeParada)
  codigoDeParadaId: number;

  @hasMany(() => OperarioXProcesoXTarjeta)
  operarioXProcesoXTarjetas: OperarioXProcesoXTarjeta[];

  constructor(data?: Partial<ProcesoXTarjeta>) {
    super(data);
  }
}

export interface ProcesoXTarjetaRelations {
  // describe navigational properties here
}

export type ProcesoXTarjetaWithRelations = ProcesoXTarjeta & ProcesoXTarjetaRelations;

import {belongsTo, Entity, model, property} from '@loopback/repository';
import {CodigoDeParada} from './codigo-de-parada.model';
import {Operario} from './operario.model';
import {ProcesoXTarjeta} from './proceso-x-tarjeta.model';

@model()
export class Parada extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  id?: number;

  @property({
    type: 'number',
    required: true,
  })
  cantidadReportada: number;

  @property({
    type: 'string',
    mysql: {
      dataType: 'datetime',
    },
  })
  fecha: string;

  @belongsTo(() => ProcesoXTarjeta)
  procesoXTarjetaId: number;

  @belongsTo(() => CodigoDeParada)
  codigoDeParadaId: number;

  @belongsTo(() => Operario)
  operarioId: number;

  constructor(data?: Partial<Parada>) {
    super(data);
  }
}

export interface ParadaRelations {
  // describe navigational properties here
}

export type ParadaWithRelations = Parada & ParadaRelations;

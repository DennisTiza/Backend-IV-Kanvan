import {Entity, model, property, belongsTo} from '@loopback/repository';
import {Operario} from './operario.model';
import {ProcesoXTarjeta} from './proceso-x-tarjeta.model';

@model()
export class OperarioXProcesoXTarjeta extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  id?: number;

  @belongsTo(() => Operario)
  operarioId: number;

  @belongsTo(() => ProcesoXTarjeta)
  procesoXTarjetaId: number;

  constructor(data?: Partial<OperarioXProcesoXTarjeta>) {
    super(data);
  }
}

export interface OperarioXProcesoXTarjetaRelations {
  // describe navigational properties here
}

export type OperarioXProcesoXTarjetaWithRelations = OperarioXProcesoXTarjeta & OperarioXProcesoXTarjetaRelations;

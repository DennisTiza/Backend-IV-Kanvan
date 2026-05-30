import {Entity, hasMany, model, property} from '@loopback/repository';
import {ProcesoXTarjeta} from './proceso-x-tarjeta.model';

@model()
export class Operario extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  id?: number;

  @property({
    type: 'string',
    required: true,
  })
  nombre: string;

  @property({
    type: 'string',
    required: true,
  })
  apellido: string;

  @hasMany(() => ProcesoXTarjeta)
  procesoXTarjetas: ProcesoXTarjeta[];

  constructor(data?: Partial<Operario>) {
    super(data);
  }
}

export interface OperarioRelations {
  // describe navigational properties here
}

export type OperarioWithRelations = Operario & OperarioRelations;

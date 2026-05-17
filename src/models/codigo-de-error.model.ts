import {Entity, model, property, hasMany} from '@loopback/repository';
import {ProcesoXTarjeta} from './proceso-x-tarjeta.model';

@model()
export class CodigoDeError extends Entity {
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
  codigo: string;

  @property({
    type: 'string',
    required: true,
  })
  descripcion: string;

  @hasMany(() => ProcesoXTarjeta)
  procesoXTarjetas: ProcesoXTarjeta[];

  constructor(data?: Partial<CodigoDeError>) {
    super(data);
  }
}

export interface CodigoDeErrorRelations {
  // describe navigational properties here
}

export type CodigoDeErrorWithRelations = CodigoDeError & CodigoDeErrorRelations;

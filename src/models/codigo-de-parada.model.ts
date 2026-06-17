import {Entity, hasMany, model, property} from '@loopback/repository';
import {Parada} from './parada.model';

@model()
export class CodigoDeParada extends Entity {
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

  @hasMany(() => Parada)
  paradas: Parada[];

  constructor(data?: Partial<CodigoDeParada>) {
    super(data);
  }
}

export interface CodigoDeParadaRelations {
  // describe navigational properties here
}

export type CodigoDeParadaWithRelations = CodigoDeParada & CodigoDeParadaRelations;

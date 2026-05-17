import {Entity, model, property, hasMany} from '@loopback/repository';
import {ProductoXProceso} from './producto-x-proceso.model';
import {ProcesoXTarjeta} from './proceso-x-tarjeta.model';

@model()
export class Proceso extends Entity {
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
  nombre: string;

  @hasMany(() => ProductoXProceso)
  productoXProcesos: ProductoXProceso[];

  @hasMany(() => ProcesoXTarjeta)
  procesoXTarjetas: ProcesoXTarjeta[];

  constructor(data?: Partial<Proceso>) {
    super(data);
  }
}

export interface ProcesoRelations {
  // describe navigational properties here
}

export type ProcesoWithRelations = Proceso & ProcesoRelations;

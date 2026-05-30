import {belongsTo, Entity, hasMany, model, property} from '@loopback/repository';
import {ProcesoXTarjeta} from './proceso-x-tarjeta.model';
import {Producto} from './producto.model';

@model()
export class TarjetaDeProduccion extends Entity {
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
    type: 'number',
    required: true,
  })
  cantidad: number;

  @property({
    type: 'date',
    required: true,
  })
  fechaPlaneada: Date;

  @property({
    type: 'string',
    mysql: {
      dataType: 'datetime',
    },
  })
  fechaInicio: string;

  @property({
    type: 'string',
    mysql: {
      dataType: 'datetime',
    },
  })
  fechaFinal: string;

  @property({
    type: 'string',
    required: true,
  })
  estado: string;

  @belongsTo(() => Producto)
  productoId: number;

  @hasMany(() => ProcesoXTarjeta)
  procesoXTarjetas: ProcesoXTarjeta[];

  constructor(data?: Partial<TarjetaDeProduccion>) {
    super(data);
  }
}

export interface TarjetaDeProduccionRelations {
  // describe navigational properties here
}

export type TarjetaDeProduccionWithRelations = TarjetaDeProduccion & TarjetaDeProduccionRelations;


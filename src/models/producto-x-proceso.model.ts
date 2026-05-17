import {Entity, model, property, belongsTo} from '@loopback/repository';
import {Producto} from './producto.model';
import {Proceso} from './proceso.model';

@model()
export class ProductoXProceso extends Entity {
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
  cantidad: number;

  @property({
    type: 'number',
    required: true,
  })
  tiempo: number;

  @belongsTo(() => Producto)
  productoId: number;

  @belongsTo(() => Proceso)
  procesoId: number;

  constructor(data?: Partial<ProductoXProceso>) {
    super(data);
  }
}

export interface ProductoXProcesoRelations {
  // describe navigational properties here
}

export type ProductoXProcesoWithRelations = ProductoXProceso & ProductoXProcesoRelations;

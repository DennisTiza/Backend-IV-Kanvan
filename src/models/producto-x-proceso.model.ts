import {belongsTo, Entity, model, property} from '@loopback/repository';
import {Proceso} from './proceso.model';
import {Producto} from './producto.model';

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

  @property({
    type: 'number',
    required: true,
  })
  orden: number;

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

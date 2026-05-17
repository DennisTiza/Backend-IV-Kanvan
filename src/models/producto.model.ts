import {Entity, model, property, hasMany} from '@loopback/repository';
import {ProductoXProceso} from './producto-x-proceso.model';

@model()
export class Producto extends Entity {
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

  constructor(data?: Partial<Producto>) {
    super(data);
  }
}

export interface ProductoRelations {
  // describe navigational properties here
}

export type ProductoWithRelations = Producto & ProductoRelations;

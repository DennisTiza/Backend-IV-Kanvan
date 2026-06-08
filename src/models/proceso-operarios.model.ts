import {model, property} from '@loopback/repository';
import {ProcesoXTarjeta} from './proceso-x-tarjeta.model';

@model()
export class ProcesoOperarios extends ProcesoXTarjeta {
  @property({
    type: 'array',
    itemType: 'number',
  })
  operariosIds?: number[];

  constructor(data?: Partial<ProcesoOperarios>) {
    super(data);
  }
}

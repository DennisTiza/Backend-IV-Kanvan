import {belongsTo, Entity, model, property} from '@loopback/repository';
import {CodigoDeError} from './codigo-de-error.model';
import {Usuario} from './usuario.model';
import {Proceso} from './proceso.model';
import {TarjetaDeProduccion} from './tarjeta-de-produccion.model';
@model()
export class ProcesoXTarjeta extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  id?: number;
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
    type: 'number',
  })
  cantidad: number;
  @property({
    type: 'number',
  })
  tiempo: number;
  @belongsTo(() => Proceso)
  procesoId: number;
  @belongsTo(() => Usuario)
  usuarioId: number;
  @belongsTo(() => TarjetaDeProduccion)
  tarjetaDeProduccionId: number;
  @belongsTo(() => CodigoDeError)
  codigoDeErrorId: number;
  constructor(data?: Partial<ProcesoXTarjeta>) {
    super(data);
  }
}
export interface ProcesoXTarjetaRelations {
  // describe navigational properties here
}
export type ProcesoXTarjetaWithRelations = ProcesoXTarjeta & ProcesoXTarjetaRelations;



import {Entity, model, property, belongsTo} from '@loopback/repository';
import {Proceso} from './proceso.model';
import {Usuario} from './usuario.model';
import {TarjetaDeProduccion} from './tarjeta-de-produccion.model';
import {CodigoDeError} from './codigo-de-error.model';

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

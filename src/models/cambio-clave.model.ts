import {Entity, model, property} from '@loopback/repository';

@model()
export class CambioClave extends Entity {
  @property({
    type: 'string',
    required: true,
  })
  correo: string;

  @property({
    type: 'string',
    required: true,
  })
  claveActual: string;

  @property({
    type: 'string',
    required: true,
  })
  claveNueva: string;

  constructor(data?: Partial<CambioClave>) {
    super(data);
  }
}

export interface CambiarClaveRelations {
  // describe navigational properties here
}

export type CambiarClaveWithRelations = CambioClave & CambiarClaveRelations;

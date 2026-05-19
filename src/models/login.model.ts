import {belongsTo, Entity, model, property} from '@loopback/repository';
import {Usuario} from './usuario.model';

@model()
export class Login extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  id?: number;

  @property({
    type: 'string',
    required: true,
    mysql: {
      dataType: 'datetime',
    },
  })
  fecha: string;

  @property({
    type: 'string',
    required: true,
  })
  token: string;

  @belongsTo(() => Usuario)
  usuarioId: number;

  constructor(data?: Partial<Login>) {
    super(data);
  }
}

export interface LoginRelations {
  // describe navigational properties here
}

export type LoginWithRelations = Login & LoginRelations;

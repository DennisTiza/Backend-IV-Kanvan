import {Getter, inject} from '@loopback/core';
import {BelongsToAccessor, DefaultCrudRepository, repository} from '@loopback/repository';
import {MysqlDataSource} from '../datasources';
import {Login, LoginRelations, Usuario} from '../models';
import {UsuarioRepository} from './usuario.repository';

export class LoginRepository extends DefaultCrudRepository<
  Login,
  typeof Login.prototype.id,
  LoginRelations
> {
  public readonly usuario: BelongsToAccessor<Usuario, typeof Login.prototype.id>;

  constructor(
    @inject('datasources.mysql') dataSource: MysqlDataSource, @repository.getter('UsuarioRepository') protected usuarioRepositoryGetter: Getter<UsuarioRepository>,
  ) {
    super(Login, dataSource);
    this.usuario = this.createBelongsToAccessorFor('usuario', usuarioRepositoryGetter,);
    this.registerInclusionResolver('usuario', this.usuario.inclusionResolver);
  }
}

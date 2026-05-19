import {Getter, inject} from '@loopback/core';
import {BelongsToAccessor, DefaultCrudRepository, HasManyRepositoryFactory, repository} from '@loopback/repository';
import {MysqlDataSource} from '../datasources';
import {Login, ProcesoXTarjeta, Rol, Usuario, UsuarioRelations} from '../models';
import {LoginRepository} from './login.repository';
import {ProcesoXTarjetaRepository} from './proceso-x-tarjeta.repository';
import {RolRepository} from './rol.repository';

export class UsuarioRepository extends DefaultCrudRepository<
  Usuario,
  typeof Usuario.prototype.id,
  UsuarioRelations
> {
  public readonly logins: HasManyRepositoryFactory<Login, typeof Usuario.prototype.id>;
  public readonly rol: BelongsToAccessor<Rol, typeof Usuario.prototype.id>;
  public readonly procesoXTarjetas: HasManyRepositoryFactory<ProcesoXTarjeta, typeof Usuario.prototype.id>;

  constructor(
    @inject('datasources.mysql') dataSource: MysqlDataSource, @repository.getter('ProcesoXTarjetaRepository') protected procesoXTarjetaRepositoryGetter: Getter<ProcesoXTarjetaRepository>, @repository.getter('RolRepository') protected rolRepositoryGetter: Getter<RolRepository>, @repository.getter('LoginRepository') protected loginRepositoryGetter: Getter<LoginRepository>,
  ) {
    super(Usuario, dataSource);
    this.procesoXTarjetas = this.createHasManyRepositoryFactoryFor('procesoXTarjetas', procesoXTarjetaRepositoryGetter,);
    this.registerInclusionResolver('procesoXTarjetas', this.procesoXTarjetas.inclusionResolver);
    this.rol = this.createBelongsToAccessorFor('rol', rolRepositoryGetter,);
    this.registerInclusionResolver('rol', this.rol.inclusionResolver);
    this.logins = this.createHasManyRepositoryFactoryFor('logins', loginRepositoryGetter,);
    this.registerInclusionResolver('logins', this.logins.inclusionResolver);
  }
}

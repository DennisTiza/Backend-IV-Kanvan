import {inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, HasManyRepositoryFactory} from '@loopback/repository';
import {MysqlDataSource} from '../datasources';
import {Usuario, UsuarioRelations, ProcesoXTarjeta} from '../models';
import {ProcesoXTarjetaRepository} from './proceso-x-tarjeta.repository';

export class UsuarioRepository extends DefaultCrudRepository<
  Usuario,
  typeof Usuario.prototype.id,
  UsuarioRelations
> {

  public readonly procesoXTarjetas: HasManyRepositoryFactory<ProcesoXTarjeta, typeof Usuario.prototype.id>;

  constructor(
    @inject('datasources.mysql') dataSource: MysqlDataSource, @repository.getter('ProcesoXTarjetaRepository') protected procesoXTarjetaRepositoryGetter: Getter<ProcesoXTarjetaRepository>,
  ) {
    super(Usuario, dataSource);
    this.procesoXTarjetas = this.createHasManyRepositoryFactoryFor('procesoXTarjetas', procesoXTarjetaRepositoryGetter,);
    this.registerInclusionResolver('procesoXTarjetas', this.procesoXTarjetas.inclusionResolver);
  }
}

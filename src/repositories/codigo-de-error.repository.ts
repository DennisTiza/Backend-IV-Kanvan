import {inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, HasManyRepositoryFactory} from '@loopback/repository';
import {MysqlDataSource} from '../datasources';
import {CodigoDeError, CodigoDeErrorRelations, ProcesoXTarjeta} from '../models';
import {ProcesoXTarjetaRepository} from './proceso-x-tarjeta.repository';

export class CodigoDeErrorRepository extends DefaultCrudRepository<
  CodigoDeError,
  typeof CodigoDeError.prototype.id,
  CodigoDeErrorRelations
> {

  public readonly procesoXTarjetas: HasManyRepositoryFactory<ProcesoXTarjeta, typeof CodigoDeError.prototype.id>;

  constructor(
    @inject('datasources.mysql') dataSource: MysqlDataSource, @repository.getter('ProcesoXTarjetaRepository') protected procesoXTarjetaRepositoryGetter: Getter<ProcesoXTarjetaRepository>,
  ) {
    super(CodigoDeError, dataSource);
    this.procesoXTarjetas = this.createHasManyRepositoryFactoryFor('procesoXTarjetas', procesoXTarjetaRepositoryGetter,);
    this.registerInclusionResolver('procesoXTarjetas', this.procesoXTarjetas.inclusionResolver);
  }
}

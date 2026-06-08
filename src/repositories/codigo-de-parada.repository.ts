import {Getter, inject} from '@loopback/core';
import {DefaultCrudRepository, HasManyRepositoryFactory, repository} from '@loopback/repository';
import {MysqlDataSource} from '../datasources';
import {CodigoDeParada, CodigoDeParadaRelations, ProcesoXTarjeta} from '../models';
import {ProcesoXTarjetaRepository} from './proceso-x-tarjeta.repository';

export class CodigoDeParadaRepository extends DefaultCrudRepository<
  CodigoDeParada,
  typeof CodigoDeParada.prototype.id,
  CodigoDeParadaRelations
> {

  public readonly procesoXTarjetas: HasManyRepositoryFactory<ProcesoXTarjeta, typeof CodigoDeParada.prototype.id>;

  constructor(
    @inject('datasources.mysql') dataSource: MysqlDataSource, @repository.getter('ProcesoXTarjetaRepository') protected procesoXTarjetaRepositoryGetter: Getter<ProcesoXTarjetaRepository>,
  ) {
    super(CodigoDeParada, dataSource);
    this.procesoXTarjetas = this.createHasManyRepositoryFactoryFor('procesoXTarjetas', procesoXTarjetaRepositoryGetter,);
    this.registerInclusionResolver('procesoXTarjetas', this.procesoXTarjetas.inclusionResolver);
  }
}

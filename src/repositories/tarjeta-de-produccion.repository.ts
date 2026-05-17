import {inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, HasManyRepositoryFactory} from '@loopback/repository';
import {MysqlDataSource} from '../datasources';
import {TarjetaDeProduccion, TarjetaDeProduccionRelations, ProcesoXTarjeta} from '../models';
import {ProcesoXTarjetaRepository} from './proceso-x-tarjeta.repository';

export class TarjetaDeProduccionRepository extends DefaultCrudRepository<
  TarjetaDeProduccion,
  typeof TarjetaDeProduccion.prototype.id,
  TarjetaDeProduccionRelations
> {

  public readonly procesoXTarjetas: HasManyRepositoryFactory<ProcesoXTarjeta, typeof TarjetaDeProduccion.prototype.id>;

  constructor(
    @inject('datasources.mysql') dataSource: MysqlDataSource, @repository.getter('ProcesoXTarjetaRepository') protected procesoXTarjetaRepositoryGetter: Getter<ProcesoXTarjetaRepository>,
  ) {
    super(TarjetaDeProduccion, dataSource);
    this.procesoXTarjetas = this.createHasManyRepositoryFactoryFor('procesoXTarjetas', procesoXTarjetaRepositoryGetter,);
    this.registerInclusionResolver('procesoXTarjetas', this.procesoXTarjetas.inclusionResolver);
  }
}

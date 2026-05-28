import {inject, Getter} from '@loopback/core';
import {BelongsToAccessor, DefaultCrudRepository, repository, HasManyRepositoryFactory} from '@loopback/repository';
import {MysqlDataSource} from '../datasources';
import {Producto, TarjetaDeProduccion, TarjetaDeProduccionRelations, ProcesoXTarjeta} from '../models';
import {ProcesoXTarjetaRepository} from './proceso-x-tarjeta.repository';
import {ProductoRepository} from './producto.repository';

export class TarjetaDeProduccionRepository extends DefaultCrudRepository<
  TarjetaDeProduccion,
  typeof TarjetaDeProduccion.prototype.id,
  TarjetaDeProduccionRelations
> {

  public readonly procesoXTarjetas: HasManyRepositoryFactory<ProcesoXTarjeta, typeof TarjetaDeProduccion.prototype.id>;

  public readonly producto: BelongsToAccessor<Producto, typeof TarjetaDeProduccion.prototype.id>;

  constructor(
    @inject('datasources.mysql') dataSource: MysqlDataSource, @repository.getter('ProcesoXTarjetaRepository') protected procesoXTarjetaRepositoryGetter: Getter<ProcesoXTarjetaRepository>, @repository.getter('ProductoRepository') protected productoRepositoryGetter: Getter<ProductoRepository>,
  ) {
    super(TarjetaDeProduccion, dataSource);
    this.procesoXTarjetas = this.createHasManyRepositoryFactoryFor('procesoXTarjetas', procesoXTarjetaRepositoryGetter,);
    this.registerInclusionResolver('procesoXTarjetas', this.procesoXTarjetas.inclusionResolver);
    this.producto = this.createBelongsToAccessorFor('producto', productoRepositoryGetter,);
    this.registerInclusionResolver('producto', this.producto.inclusionResolver);
  }
}










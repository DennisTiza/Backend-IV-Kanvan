import {inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, HasManyRepositoryFactory} from '@loopback/repository';
import {MysqlDataSource} from '../datasources';
import {Proceso, ProcesoRelations, ProductoXProceso, ProcesoXTarjeta} from '../models';
import {ProductoXProcesoRepository} from './producto-x-proceso.repository';
import {ProcesoXTarjetaRepository} from './proceso-x-tarjeta.repository';

export class ProcesoRepository extends DefaultCrudRepository<
  Proceso,
  typeof Proceso.prototype.id,
  ProcesoRelations
> {

  public readonly productoXProcesos: HasManyRepositoryFactory<ProductoXProceso, typeof Proceso.prototype.id>;

  public readonly procesoXTarjetas: HasManyRepositoryFactory<ProcesoXTarjeta, typeof Proceso.prototype.id>;

  constructor(
    @inject('datasources.mysql') dataSource: MysqlDataSource, @repository.getter('ProductoXProcesoRepository') protected productoXProcesoRepositoryGetter: Getter<ProductoXProcesoRepository>, @repository.getter('ProcesoXTarjetaRepository') protected procesoXTarjetaRepositoryGetter: Getter<ProcesoXTarjetaRepository>,
  ) {
    super(Proceso, dataSource);
    this.procesoXTarjetas = this.createHasManyRepositoryFactoryFor('procesoXTarjetas', procesoXTarjetaRepositoryGetter,);
    this.registerInclusionResolver('procesoXTarjetas', this.procesoXTarjetas.inclusionResolver);
    this.productoXProcesos = this.createHasManyRepositoryFactoryFor('productoXProcesos', productoXProcesoRepositoryGetter,);
    this.registerInclusionResolver('productoXProcesos', this.productoXProcesos.inclusionResolver);
  }
}

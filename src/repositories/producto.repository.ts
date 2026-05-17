import {inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, HasManyRepositoryFactory} from '@loopback/repository';
import {MysqlDataSource} from '../datasources';
import {Producto, ProductoRelations, ProductoXProceso} from '../models';
import {ProductoXProcesoRepository} from './producto-x-proceso.repository';

export class ProductoRepository extends DefaultCrudRepository<
  Producto,
  typeof Producto.prototype.id,
  ProductoRelations
> {

  public readonly productoXProcesos: HasManyRepositoryFactory<ProductoXProceso, typeof Producto.prototype.id>;

  constructor(
    @inject('datasources.mysql') dataSource: MysqlDataSource, @repository.getter('ProductoXProcesoRepository') protected productoXProcesoRepositoryGetter: Getter<ProductoXProcesoRepository>,
  ) {
    super(Producto, dataSource);
    this.productoXProcesos = this.createHasManyRepositoryFactoryFor('productoXProcesos', productoXProcesoRepositoryGetter,);
    this.registerInclusionResolver('productoXProcesos', this.productoXProcesos.inclusionResolver);
  }
}

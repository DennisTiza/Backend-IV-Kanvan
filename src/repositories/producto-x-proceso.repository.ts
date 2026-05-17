import {inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, BelongsToAccessor} from '@loopback/repository';
import {MysqlDataSource} from '../datasources';
import {ProductoXProceso, ProductoXProcesoRelations, Producto, Proceso} from '../models';
import {ProductoRepository} from './producto.repository';
import {ProcesoRepository} from './proceso.repository';

export class ProductoXProcesoRepository extends DefaultCrudRepository<
  ProductoXProceso,
  typeof ProductoXProceso.prototype.id,
  ProductoXProcesoRelations
> {

  public readonly producto: BelongsToAccessor<Producto, typeof ProductoXProceso.prototype.id>;

  public readonly proceso: BelongsToAccessor<Proceso, typeof ProductoXProceso.prototype.id>;

  constructor(
    @inject('datasources.mysql') dataSource: MysqlDataSource, @repository.getter('ProductoRepository') protected productoRepositoryGetter: Getter<ProductoRepository>, @repository.getter('ProcesoRepository') protected procesoRepositoryGetter: Getter<ProcesoRepository>,
  ) {
    super(ProductoXProceso, dataSource);
    this.proceso = this.createBelongsToAccessorFor('proceso', procesoRepositoryGetter,);
    this.registerInclusionResolver('proceso', this.proceso.inclusionResolver);
    this.producto = this.createBelongsToAccessorFor('producto', productoRepositoryGetter,);
    this.registerInclusionResolver('producto', this.producto.inclusionResolver);
  }
}

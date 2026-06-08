import {inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, BelongsToAccessor} from '@loopback/repository';
import {MysqlDataSource} from '../datasources';
import {OperarioXProcesoXTarjeta, OperarioXProcesoXTarjetaRelations, Operario, ProcesoXTarjeta} from '../models';
import {OperarioRepository} from './operario.repository';
import {ProcesoXTarjetaRepository} from './proceso-x-tarjeta.repository';

export class OperarioXProcesoXTarjetaRepository extends DefaultCrudRepository<
  OperarioXProcesoXTarjeta,
  typeof OperarioXProcesoXTarjeta.prototype.id,
  OperarioXProcesoXTarjetaRelations
> {

  public readonly operario: BelongsToAccessor<Operario, typeof OperarioXProcesoXTarjeta.prototype.id>;

  public readonly procesoXTarjeta: BelongsToAccessor<ProcesoXTarjeta, typeof OperarioXProcesoXTarjeta.prototype.id>;

  constructor(
    @inject('datasources.mysql') dataSource: MysqlDataSource, @repository.getter('OperarioRepository') protected operarioRepositoryGetter: Getter<OperarioRepository>, @repository.getter('ProcesoXTarjetaRepository') protected procesoXTarjetaRepositoryGetter: Getter<ProcesoXTarjetaRepository>,
  ) {
    super(OperarioXProcesoXTarjeta, dataSource);
    this.procesoXTarjeta = this.createBelongsToAccessorFor('procesoXTarjeta', procesoXTarjetaRepositoryGetter,);
    this.registerInclusionResolver('procesoXTarjeta', this.procesoXTarjeta.inclusionResolver);
    this.operario = this.createBelongsToAccessorFor('operario', operarioRepositoryGetter,);
    this.registerInclusionResolver('operario', this.operario.inclusionResolver);
  }
}

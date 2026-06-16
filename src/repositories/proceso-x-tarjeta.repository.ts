import {Getter, inject} from '@loopback/core';
import {BelongsToAccessor, DefaultCrudRepository, HasManyRepositoryFactory, repository} from '@loopback/repository';
import {MysqlDataSource} from '../datasources';
import {OperarioXProcesoXTarjeta, Parada, Proceso, ProcesoXTarjeta, ProcesoXTarjetaRelations, TarjetaDeProduccion} from '../models';
import {OperarioXProcesoXTarjetaRepository} from './operario-x-proceso-x-tarjeta.repository';
import {ParadaRepository} from './parada.repository';
import {ProcesoRepository} from './proceso.repository';
import {TarjetaDeProduccionRepository} from './tarjeta-de-produccion.repository';

export class ProcesoXTarjetaRepository extends DefaultCrudRepository<
  ProcesoXTarjeta,
  typeof ProcesoXTarjeta.prototype.id,
  ProcesoXTarjetaRelations
> {

  public readonly proceso: BelongsToAccessor<Proceso, typeof ProcesoXTarjeta.prototype.id>;

  public readonly tarjetaDeProduccion: BelongsToAccessor<TarjetaDeProduccion, typeof ProcesoXTarjeta.prototype.id>;

  public readonly operarioXProcesoXTarjetas: HasManyRepositoryFactory<OperarioXProcesoXTarjeta, typeof ProcesoXTarjeta.prototype.id>;

  public readonly paradas: HasManyRepositoryFactory<Parada, typeof ProcesoXTarjeta.prototype.id>;

  constructor(
    @inject('datasources.mysql') dataSource: MysqlDataSource, @repository.getter('ProcesoRepository') protected procesoRepositoryGetter: Getter<ProcesoRepository>, @repository.getter('TarjetaDeProduccionRepository') protected tarjetaDeProduccionRepositoryGetter: Getter<TarjetaDeProduccionRepository>, @repository.getter('OperarioXProcesoXTarjetaRepository') protected operarioXProcesoXTarjetaRepositoryGetter: Getter<OperarioXProcesoXTarjetaRepository>, @repository.getter('ParadaRepository') protected paradaRepositoryGetter: Getter<ParadaRepository>,
  ) {
    super(ProcesoXTarjeta, dataSource);
    this.operarioXProcesoXTarjetas = this.createHasManyRepositoryFactoryFor('operarioXProcesoXTarjetas', operarioXProcesoXTarjetaRepositoryGetter,);
    this.registerInclusionResolver('operarioXProcesoXTarjetas', this.operarioXProcesoXTarjetas.inclusionResolver);
    this.tarjetaDeProduccion = this.createBelongsToAccessorFor('tarjetaDeProduccion', tarjetaDeProduccionRepositoryGetter,);
    this.registerInclusionResolver('tarjetaDeProduccion', this.tarjetaDeProduccion.inclusionResolver);
    this.proceso = this.createBelongsToAccessorFor('proceso', procesoRepositoryGetter,);
    this.registerInclusionResolver('proceso', this.proceso.inclusionResolver);
    this.paradas = this.createHasManyRepositoryFactoryFor('paradas', paradaRepositoryGetter,);
    this.registerInclusionResolver('paradas', this.paradas.inclusionResolver);
  }
}





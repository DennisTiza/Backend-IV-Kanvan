import {Getter, inject} from '@loopback/core';
import {BelongsToAccessor, DefaultCrudRepository, repository} from '@loopback/repository';
import {MysqlDataSource} from '../datasources';
import {CodigoDeError, Operario, Proceso, ProcesoXTarjeta, ProcesoXTarjetaRelations, TarjetaDeProduccion} from '../models';
import {CodigoDeErrorRepository} from './codigo-de-error.repository';
import {OperarioRepository} from './operario.repository';
import {ProcesoRepository} from './proceso.repository';
import {TarjetaDeProduccionRepository} from './tarjeta-de-produccion.repository';

export class ProcesoXTarjetaRepository extends DefaultCrudRepository<
  ProcesoXTarjeta,
  typeof ProcesoXTarjeta.prototype.id,
  ProcesoXTarjetaRelations
> {

  public readonly proceso: BelongsToAccessor<Proceso, typeof ProcesoXTarjeta.prototype.id>;

  public readonly tarjetaDeProduccion: BelongsToAccessor<TarjetaDeProduccion, typeof ProcesoXTarjeta.prototype.id>;

  public readonly codigoDeError: BelongsToAccessor<CodigoDeError, typeof ProcesoXTarjeta.prototype.id>;

  public readonly operario: BelongsToAccessor<Operario, typeof ProcesoXTarjeta.prototype.id>;

  constructor(
    @inject('datasources.mysql') dataSource: MysqlDataSource, @repository.getter('ProcesoRepository') protected procesoRepositoryGetter: Getter<ProcesoRepository>, @repository.getter('TarjetaDeProduccionRepository') protected tarjetaDeProduccionRepositoryGetter: Getter<TarjetaDeProduccionRepository>, @repository.getter('CodigoDeErrorRepository') protected codigoDeErrorRepositoryGetter: Getter<CodigoDeErrorRepository>, @repository.getter('OperarioRepository') protected operarioRepositoryGetter: Getter<OperarioRepository>,
  ) {
    super(ProcesoXTarjeta, dataSource);
    this.operario = this.createBelongsToAccessorFor('operario', operarioRepositoryGetter,);
    this.registerInclusionResolver('operario', this.operario.inclusionResolver);
    this.codigoDeError = this.createBelongsToAccessorFor('codigoDeError', codigoDeErrorRepositoryGetter,);
    this.registerInclusionResolver('codigoDeError', this.codigoDeError.inclusionResolver);
    this.tarjetaDeProduccion = this.createBelongsToAccessorFor('tarjetaDeProduccion', tarjetaDeProduccionRepositoryGetter,);
    this.registerInclusionResolver('tarjetaDeProduccion', this.tarjetaDeProduccion.inclusionResolver);
    this.proceso = this.createBelongsToAccessorFor('proceso', procesoRepositoryGetter,);
    this.registerInclusionResolver('proceso', this.proceso.inclusionResolver);
  }
}





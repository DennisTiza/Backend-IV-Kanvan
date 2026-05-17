import {inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, BelongsToAccessor} from '@loopback/repository';
import {MysqlDataSource} from '../datasources';
import {ProcesoXTarjeta, ProcesoXTarjetaRelations, Proceso, Usuario, TarjetaDeProduccion, CodigoDeError} from '../models';
import {ProcesoRepository} from './proceso.repository';
import {UsuarioRepository} from './usuario.repository';
import {TarjetaDeProduccionRepository} from './tarjeta-de-produccion.repository';
import {CodigoDeErrorRepository} from './codigo-de-error.repository';

export class ProcesoXTarjetaRepository extends DefaultCrudRepository<
  ProcesoXTarjeta,
  typeof ProcesoXTarjeta.prototype.id,
  ProcesoXTarjetaRelations
> {

  public readonly proceso: BelongsToAccessor<Proceso, typeof ProcesoXTarjeta.prototype.id>;

  public readonly usuario: BelongsToAccessor<Usuario, typeof ProcesoXTarjeta.prototype.id>;

  public readonly tarjetaDeProduccion: BelongsToAccessor<TarjetaDeProduccion, typeof ProcesoXTarjeta.prototype.id>;

  public readonly codigoDeError: BelongsToAccessor<CodigoDeError, typeof ProcesoXTarjeta.prototype.id>;

  constructor(
    @inject('datasources.mysql') dataSource: MysqlDataSource, @repository.getter('ProcesoRepository') protected procesoRepositoryGetter: Getter<ProcesoRepository>, @repository.getter('UsuarioRepository') protected usuarioRepositoryGetter: Getter<UsuarioRepository>, @repository.getter('TarjetaDeProduccionRepository') protected tarjetaDeProduccionRepositoryGetter: Getter<TarjetaDeProduccionRepository>, @repository.getter('CodigoDeErrorRepository') protected codigoDeErrorRepositoryGetter: Getter<CodigoDeErrorRepository>,
  ) {
    super(ProcesoXTarjeta, dataSource);
    this.codigoDeError = this.createBelongsToAccessorFor('codigoDeError', codigoDeErrorRepositoryGetter,);
    this.registerInclusionResolver('codigoDeError', this.codigoDeError.inclusionResolver);
    this.tarjetaDeProduccion = this.createBelongsToAccessorFor('tarjetaDeProduccion', tarjetaDeProduccionRepositoryGetter,);
    this.registerInclusionResolver('tarjetaDeProduccion', this.tarjetaDeProduccion.inclusionResolver);
    this.usuario = this.createBelongsToAccessorFor('usuario', usuarioRepositoryGetter,);
    this.registerInclusionResolver('usuario', this.usuario.inclusionResolver);
    this.proceso = this.createBelongsToAccessorFor('proceso', procesoRepositoryGetter,);
    this.registerInclusionResolver('proceso', this.proceso.inclusionResolver);
  }
}

import {Getter, inject} from '@loopback/core';
import {
  BelongsToAccessor,
  DefaultCrudRepository,
  repository,
} from '@loopback/repository';
import {MysqlDataSource} from '../datasources';
import {
  CodigoDeParada,
  Operario,
  ProcesoXTarjeta,
  RegistroDeCantidad,
  RegistroDeCantidadRelations,
} from '../models';
import {CodigoDeParadaRepository} from './codigo-de-parada.repository';
import {OperarioRepository} from './operario.repository';
import {ProcesoXTarjetaRepository} from './proceso-x-tarjeta.repository';

export class RegistroDeCantidadRepository extends DefaultCrudRepository<
  RegistroDeCantidad,
  typeof RegistroDeCantidad.prototype.id,
  RegistroDeCantidadRelations
> {
  public readonly procesoXTarjeta: BelongsToAccessor<
    ProcesoXTarjeta,
    typeof RegistroDeCantidad.prototype.id
  >;

  public readonly operario: BelongsToAccessor<
    Operario,
    typeof RegistroDeCantidad.prototype.id
  >;

  public readonly codigoDeParada: BelongsToAccessor<
    CodigoDeParada,
    typeof RegistroDeCantidad.prototype.id
  >;

  constructor(
    @inject('datasources.mysql') dataSource: MysqlDataSource,
    @repository.getter('ProcesoXTarjetaRepository')
    protected procesoXTarjetaRepositoryGetter: Getter<ProcesoXTarjetaRepository>,
    @repository.getter('OperarioRepository')
    protected operarioRepositoryGetter: Getter<OperarioRepository>,
    @repository.getter('CodigoDeParadaRepository')
    protected codigoDeParadaRepositoryGetter: Getter<CodigoDeParadaRepository>,
  ) {
    super(RegistroDeCantidad, dataSource);
    this.procesoXTarjeta = this.createBelongsToAccessorFor(
      'procesoXTarjeta',
      procesoXTarjetaRepositoryGetter,
    );
    this.registerInclusionResolver(
      'procesoXTarjeta',
      this.procesoXTarjeta.inclusionResolver,
    );
    this.operario = this.createBelongsToAccessorFor(
      'operario',
      operarioRepositoryGetter,
    );
    this.registerInclusionResolver('operario', this.operario.inclusionResolver);
    this.codigoDeParada = this.createBelongsToAccessorFor(
      'codigoDeParada',
      codigoDeParadaRepositoryGetter,
    );
    this.registerInclusionResolver(
      'codigoDeParada',
      this.codigoDeParada.inclusionResolver,
    );
  }
}

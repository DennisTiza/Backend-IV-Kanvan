import {Getter, inject} from '@loopback/core';
import {
  DefaultCrudRepository,
  HasManyRepositoryFactory,
  repository,
} from '@loopback/repository';
import {MysqlDataSource} from '../datasources';
import {
  Operario,
  OperarioRelations,
  OperarioXProcesoXTarjeta,
  RegistroDeCantidad,
} from '../models';
import {OperarioXProcesoXTarjetaRepository} from './operario-x-proceso-x-tarjeta.repository';
import {RegistroDeCantidadRepository} from './registro-de-cantidad.repository';

export class OperarioRepository extends DefaultCrudRepository<
  Operario,
  typeof Operario.prototype.id,
  OperarioRelations
> {
  public readonly operarioXProcesoXTarjetas: HasManyRepositoryFactory<
    OperarioXProcesoXTarjeta,
    typeof Operario.prototype.id
  >;

  public readonly registroDeCantidads: HasManyRepositoryFactory<
    RegistroDeCantidad,
    typeof Operario.prototype.id
  >;

  constructor(
    @inject('datasources.mysql') dataSource: MysqlDataSource,
    @repository.getter('OperarioXProcesoXTarjetaRepository')
    protected operarioXProcesoXTarjetaRepositoryGetter: Getter<OperarioXProcesoXTarjetaRepository>,
    @repository.getter('RegistroDeCantidadRepository')
    protected registroDeCantidadRepositoryGetter: Getter<RegistroDeCantidadRepository>,
  ) {
    super(Operario, dataSource);
    this.operarioXProcesoXTarjetas = this.createHasManyRepositoryFactoryFor(
      'operarioXProcesoXTarjetas',
      operarioXProcesoXTarjetaRepositoryGetter,
    );
    this.registerInclusionResolver(
      'operarioXProcesoXTarjetas',
      this.operarioXProcesoXTarjetas.inclusionResolver,
    );
    this.registroDeCantidads = this.createHasManyRepositoryFactoryFor(
      'registroDeCantidads',
      registroDeCantidadRepositoryGetter,
    );
    this.registerInclusionResolver(
      'registroDeCantidads',
      this.registroDeCantidads.inclusionResolver,
    );
  }
}

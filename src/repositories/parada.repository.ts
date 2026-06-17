import {Getter, inject} from '@loopback/core';
import {
  BelongsToAccessor,
  DefaultCrudRepository,
  repository,
} from '@loopback/repository';
import {MysqlDataSource} from '../datasources';
import {CodigoDeParada, Operario, Parada, ParadaRelations} from '../models';
import {CodigoDeParadaRepository} from './codigo-de-parada.repository';
import {OperarioRepository} from './operario.repository';

export class ParadaRepository extends DefaultCrudRepository<
  Parada,
  typeof Parada.prototype.id,
  ParadaRelations
> {
  public readonly codigoDeParada: BelongsToAccessor<
    CodigoDeParada,
    typeof Parada.prototype.id
  >;

  public readonly operario: BelongsToAccessor<
    Operario,
    typeof Parada.prototype.id
  >;

  constructor(
    @inject('datasources.mysql') dataSource: MysqlDataSource,
    @repository.getter('CodigoDeParadaRepository')
    protected codigoDeParadaRepositoryGetter: Getter<CodigoDeParadaRepository>,
    @repository.getter('OperarioRepository')
    protected operarioRepositoryGetter: Getter<OperarioRepository>,
  ) {
    super(Parada, dataSource);
    this.codigoDeParada = this.createBelongsToAccessorFor(
      'codigoDeParada',
      codigoDeParadaRepositoryGetter,
    );
    this.registerInclusionResolver(
      'codigoDeParada',
      this.codigoDeParada.inclusionResolver,
    );
    this.operario = this.createBelongsToAccessorFor(
      'operario',
      operarioRepositoryGetter,
    );
    this.registerInclusionResolver('operario', this.operario.inclusionResolver);
  }
}

import {Getter, inject} from '@loopback/core';
import {DefaultCrudRepository, HasManyRepositoryFactory, repository} from '@loopback/repository';
import {MysqlDataSource} from '../datasources';
import {CodigoDeParada, CodigoDeParadaRelations, Parada} from '../models';
import {ParadaRepository} from './parada.repository';

export class CodigoDeParadaRepository extends DefaultCrudRepository<
  CodigoDeParada,
  typeof CodigoDeParada.prototype.id,
  CodigoDeParadaRelations
> {

  public readonly paradas: HasManyRepositoryFactory<Parada, typeof CodigoDeParada.prototype.id>;

  constructor(
    @inject('datasources.mysql') dataSource: MysqlDataSource, @repository.getter('ParadaRepository') protected paradaRepositoryGetter: Getter<ParadaRepository>,
  ) {
    super(CodigoDeParada, dataSource);
    this.paradas = this.createHasManyRepositoryFactoryFor('paradas', paradaRepositoryGetter,);
    this.registerInclusionResolver('paradas', this.paradas.inclusionResolver);
  }
}

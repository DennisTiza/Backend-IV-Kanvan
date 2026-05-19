import {Getter, inject} from '@loopback/core';
import {DefaultCrudRepository, HasManyThroughRepositoryFactory, repository} from '@loopback/repository';
import {MysqlDataSource} from '../datasources';
import {Menu, MenuDelRol, MenuRelations, Rol} from '../models';
import {MenuDelRolRepository} from './menu-del-rol.repository';
import {RolRepository} from './rol.repository';

export class MenuRepository extends DefaultCrudRepository<
  Menu,
  typeof Menu.prototype.id,
  MenuRelations
> {

  public readonly rols: HasManyThroughRepositoryFactory<Rol, typeof Rol.prototype.id,
    MenuDelRol,
    typeof Menu.prototype.id
  >;

  constructor(
    @inject('datasources.mysql') dataSource: MysqlDataSource, @repository.getter('MenuDelRolRepository') protected menuDelRolRepositoryGetter: Getter<MenuDelRolRepository>, @repository.getter('RolRepository') protected rolRepositoryGetter: Getter<RolRepository>,
  ) {
    super(Menu, dataSource);
    this.rols = this.createHasManyThroughRepositoryFactoryFor('rols', rolRepositoryGetter, menuDelRolRepositoryGetter,);
    this.registerInclusionResolver('rols', this.rols.inclusionResolver);
  }
}

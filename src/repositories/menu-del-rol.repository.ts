import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {MysqlDataSource} from '../datasources';
import {MenuDelRol, MenuDelRolRelations} from '../models';

export class MenuDelRolRepository extends DefaultCrudRepository<
  MenuDelRol,
  typeof MenuDelRol.prototype.id,
  MenuDelRolRelations
> {
  constructor(
    @inject('datasources.mysql') dataSource: MysqlDataSource,
  ) {
    super(MenuDelRol, dataSource);
  }
}

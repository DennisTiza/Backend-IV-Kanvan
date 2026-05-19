import {Getter, inject} from '@loopback/core';
import {DefaultCrudRepository, HasManyRepositoryFactory, HasManyThroughRepositoryFactory, repository} from '@loopback/repository';
import {MysqlDataSource} from '../datasources';
import {Menu, MenuDelRol, Rol, RolRelations, Usuario} from '../models';
import {MenuDelRolRepository} from './menu-del-rol.repository';
import {MenuRepository} from './menu.repository';
import {UsuarioRepository} from './usuario.repository';

export class RolRepository extends DefaultCrudRepository<
  Rol,
  typeof Rol.prototype.id,
  RolRelations
> {
  public readonly menus: HasManyThroughRepositoryFactory<Menu, typeof Menu.prototype.id,
    MenuDelRol,
    typeof Rol.prototype.id
  >;

  public readonly usuarios: HasManyRepositoryFactory<Usuario, typeof Rol.prototype.id>;

  constructor(
    @inject('datasources.mysql') dataSource: MysqlDataSource, @repository.getter('MenuDelRolRepository') protected menuDelRolRepositoryGetter: Getter<MenuDelRolRepository>, @repository.getter('MenuRepository') protected menuRepositoryGetter: Getter<MenuRepository>, @repository.getter('UsuarioRepository') protected usuarioRepositoryGetter: Getter<UsuarioRepository>,
  ) {
    super(Rol, dataSource);
    this.usuarios = this.createHasManyRepositoryFactoryFor('usuarios', usuarioRepositoryGetter,);
    this.registerInclusionResolver('usuarios', this.usuarios.inclusionResolver);
    this.menus = this.createHasManyThroughRepositoryFactoryFor('menus', menuRepositoryGetter, menuDelRolRepositoryGetter,);
    this.registerInclusionResolver('menus', this.menus.inclusionResolver);
  }
}

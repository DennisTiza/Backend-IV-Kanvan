import dotenv from 'dotenv';
import {juggler} from '@loopback/repository';
import {BackendIvKanvanApplication} from './application';

dotenv.config();

export async function migrate(args: string[]) {
  const existingSchema = args.includes('--rebuild') ? 'drop' : 'alter';
  console.log('Migrating schemas (%s existing schema)', existingSchema);

  const app = new BackendIvKanvanApplication();
  await app.boot();

  if (existingSchema !== 'drop') {
    console.log('Applying custom migration for model changes...');
    const ds: juggler.DataSource = await app.get('datasources.mysql');
    const alterOps = [];

    alterOps.push('ALTER TABLE ProcesoXTarjeta CHANGE COLUMN operarioId usuarioId INT NULL;');
    alterOps.push('ALTER TABLE TarjetaDeProduccion ADD COLUMN productoId INT NULL;');
    alterOps.push('ALTER TABLE ProcesoXTarjeta ADD COLUMN cantidad INT NULL;');
    alterOps.push('ALTER TABLE ProcesoXTarjeta ADD COLUMN tiempo INT NULL;');
    alterOps.push('ALTER TABLE ProductoXProceso DROP COLUMN cantidad;');
    alterOps.push('ALTER TABLE ProductoXProceso DROP COLUMN tiempo;');
    alterOps.push('DROP TABLE IF EXISTS Operario;');

    for (const sql of alterOps) {
      try {
        await ds.execute(sql);
        console.log('  OK: ' + sql.substring(0, 60) + '...');
      } catch (err) {
        console.log('  SKIP (already applied?): ' + err.message);
      }
    }
  }

  await app.migrateSchema({existingSchema});
  process.exit(0);
}

migrate(process.argv).catch(err => {
  console.error('Cannot migrate database schema', err);
  process.exit(1);
});





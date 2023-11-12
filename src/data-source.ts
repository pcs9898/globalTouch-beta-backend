import { config } from 'dotenv';

config({ path: '.env.dev' }); // local에서
// config({ path: '.env.prod' }); // 서버에서
import { ConfigService } from '@nestjs/config';
import { DataSource, DataSourceOptions } from 'typeorm';
import { SeederOptions } from 'typeorm-extension';

const configService = new ConfigService();

console.log(configService.get('DATABASE_HOST'));
const options: DataSourceOptions & SeederOptions = {
  type: 'mysql',
  host: configService.get('DATABASE_HOST'),
  port: configService.get<number>('DATABASE_PORT'),
  username: configService.get('DATABASE_USERNAME'),
  password: configService.get('DATABASE_PASSWORD'),
  database: configService.get('DATABASE_NAME'),
  synchronize: false,
  entities: ['src/apis/**/entity/*.entity.*'],
  // seeds: ['src/database/seeds/**/*{.ts,.js}'],
  seeds: ['src/database/seeds/total.seeder.ts'],
  factories: ['src/database/factories/**/*{.ts,.js}'],
  legacySpatialSupport: false,
};

// (async () => {
//   const dataSource = new DataSource(options);
//   await dataSource.initialize();

//   runSeeders(dataSource, {
//     seeds: ['database/seeds/*{.ts,.js}'],
//   });
// })();

export const dataSource = new DataSource(options);

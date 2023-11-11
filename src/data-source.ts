import { config } from 'dotenv';

config({ path: '.env.dev' }); // .env.dev 파일을 읽어 환경 변수에 로드합니다.
import { ConfigService } from '@nestjs/config';
import { DataSource, DataSourceOptions } from 'typeorm';
import { SeederOptions } from 'typeorm-extension';

const configService = new ConfigService();

console.log(configService.get('DATABASE_NAME'));
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

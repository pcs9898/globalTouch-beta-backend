import { CountryCode } from 'src/apis/countryCode/entity/countryCode.entity';
import { DataSource } from 'typeorm';
import { Seeder } from 'typeorm-extension';
const fs = require('fs');

export default class CoutnryCodeSeeder implements Seeder {
  public async run(dataSource: DataSource): Promise<any> {
    console.log('Seeding CoutnryCode...');
    const repository = dataSource.getRepository(CountryCode);

    try {
      const rawData = fs.readFileSync(
        'seeds-data/coutnryCode.seed.json',
        'utf8',
      );

      const countryCodes = JSON.parse(rawData);

      const countryCodeToInsert = countryCodes.map((country_code: string) => ({
        country_code,
      }));

      await repository.insert(countryCodeToInsert);

      console.log('CoutnryCode seeded successfully');
    } catch (error) {
      console.error('Error seeding CoutnryCode', error);
    }
  }
}

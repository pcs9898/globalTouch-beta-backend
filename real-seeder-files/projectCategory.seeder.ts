// src/db/seeds/user.seeder.ts
import { Seeder } from 'typeorm-extension';
import { DataSource } from 'typeorm';
import { ProjectCategory } from 'src/apis/projectCategory/entity/projectCategory.entity';

const fs = require('fs');

export default class ProjectCategorySeeder implements Seeder {
  public async run(dataSource: DataSource): Promise<any> {
    console.log('Seeding ProjectCategory...');
    const repository = dataSource.getRepository(ProjectCategory);

    try {
      const rawData = fs.readFileSync(
        'seeds-data/projectCategory.seed.json',
        'utf8',
      );

      const peojectCategories = JSON.parse(rawData);

      const peojectCategoriesToInsert = peojectCategories.map(
        (project_category: string) => ({
          project_category,
        }),
      );

      await repository.insert(peojectCategoriesToInsert);
      console.log('ProjectCategory seeded successfully');
    } catch (error) {
      console.error('Error seeding ProjectCategory', error);
    }
  }
}

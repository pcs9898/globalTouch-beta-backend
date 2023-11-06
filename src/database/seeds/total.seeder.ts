// src/db/seeds/total.seeder.ts
import { Seeder } from 'typeorm-extension';
import { DataSource } from 'typeorm';
import { User } from 'src/apis/user/entity/user.entity';
import { CountryCode } from 'src/apis/countryCode/entity/countryCode.entity';
import { faker } from '@faker-js/faker';
import * as bcrypt from 'bcrypt';
import { ProjectCategory } from 'src/apis/projectCategory/entity/projectCategory.entity';
import { Project } from 'src/apis/project/entity/project.entity';
import { ProjectImage } from 'src/apis/projectImage/entity/projectImage.entity';
import { ProjectDonation } from 'src/apis/projectDonation/entity/projectDonation.entity';
import { ProjectComment } from 'src/apis/projectComment/entity/projectComment.entity';
import { UpdatedProject } from 'src/apis/updatedProject/entity/updatedProject.entity';
const fs = require('fs');

export default class UserSeeder implements Seeder {
  public async run(dataSource: DataSource): Promise<any> {
    console.time('seed');
    const userRepository = dataSource.getRepository(User);
    const countryRepository = dataSource.getRepository(CountryCode);
    const projectRepository = dataSource.getRepository(Project);
    const projectImageRepository = dataSource.getRepository(ProjectImage);
    const projectCategoryRepository = dataSource.getRepository(ProjectCategory);
    const projectDonationRepository = dataSource.getRepository(ProjectDonation);
    const projectCommentRepository = dataSource.getRepository(ProjectComment);
    const updatedProjectRepository = dataSource.getRepository(UpdatedProject);
    //Create Project Array
    const projectData = fs.readFileSync('seeds-data/project.seed.json', 'utf8');
    const projects = JSON.parse(projectData);
    //Create User Array
    const usersList = [];
    const projectsList = [];

    //CountryCode
    console.log('Seeding CountryCode...');

    try {
      const rawData = fs.readFileSync(
        'seeds-data/coutnryCode.seed.json',
        'utf8',
      );
      const countryCodes = JSON.parse(rawData);
      const countryCodeToInsert = countryCodes.map((country_code: string) => ({
        country_code,
      }));
      await countryRepository.insert(countryCodeToInsert);
      console.log('CountryCode seeded successfully');
    } catch (error) {
      console.error('Error seeding CountryCode', error);
    }
    //ProjectCategory
    console.log('Seeding ProjectCategory...');

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
      await projectCategoryRepository.insert(peojectCategoriesToInsert);
      console.log('ProjectCategory seeded successfully');
    } catch (error) {
      console.error('Error seeding ProjectCategory', error);
    }

    //User
    console.log('Seeding User,Project,ProjectURl...');
    try {
      for (let i = 0; i < 100; i++) {
        const temp_countryCode = faker.location.countryCode('alpha-2');
        const countryCode = await countryRepository.findOne({
          where: { country_code: temp_countryCode },
        });
        const userUuid = faker.string.uuid();
        const userToInsert = {
          user_id: userUuid,
          email: faker.internet.email(),
          password_hash: await bcrypt.hash(faker.internet.password(), 10),
          name: faker.person.fullName(),
          profile_image_url: faker.image.url(),
        };
        await userRepository.insert(userToInsert);
        usersList.push(userUuid);
        const project = projects[i];
        const projectUuid = faker.string.uuid();
        const projectToInsert = {
          project_id: projectUuid,
          title: project.title,
          content: project.content,
          amount_required: project.amount_required,
          lat: project.lat,
          lng: project.lng,
          user: await userRepository.findOne({
            where: { user_id: userUuid },
          }),
          countryCode: await countryRepository.findOne({
            where: { country_code: project.country_code },
          }),
          projectCategory: await projectCategoryRepository.findOne({
            where: { project_category: project.project_category },
          }),
          cityName: project.cityName,
        };
        await projectRepository.insert(projectToInsert);
        projectsList.push(projectUuid);
        const temp_project = await projectRepository.findOne({
          where: { project_id: projectUuid },
        });
        //UpdatedProject
        const updatedProjectToInsert = {
          updatedProject_id: faker.string.uuid(),
          content: faker.lorem.words({ min: 20, max: 40 }),
          project: temp_project,
        };
        updatedProjectRepository.insert(updatedProjectToInsert);
        //ProjectImage
        const image_urls = project.projectImages.split(',');
        image_urls.map(async (url, i) => {
          const imageUrlToInsert = {
            projectImage_id: faker.string.uuid(),
            image_url: url,
            project: temp_project,
            image_index: i,
          };
          await projectImageRepository.insert(imageUrlToInsert);
        });
      }
      console.log('User,Project,UpdateProject,ProjectURl seeded successfully');
    } catch (error) {
      console.error(
        'Error seeding User,Project,UpdateProject,ProjectURl',
        error,
      );
    }
    //ProjectDonation
    try {
      console.log('Seeding ProjectDonation,projectComment...');
      for (let i = 0; i < 100; i++) {
        for (let j = 0; j < 3; j++) {
          let temp = i + j + 1;
          if (temp >= 100) {
            temp -= 100;
          }
          const user = await userRepository.findOne({
            where: { user_id: usersList[temp] },
          });
          const project = await projectRepository.findOne({
            where: { project_id: projectsList[i] },
          });
          const donationToInsert = {
            projectDonation_id: faker.string.uuid(),
            imp_uid: faker.string.uuid(),
            amount: faker.number.int({ min: 100, max: 10000 }),
            status: 'PAYMENT',
            user: user,
            project: project,
          };
          await projectDonationRepository.insert(donationToInsert);
          const commentToInsert = {
            projectComment_id: faker.string.uuid(),
            content: faker.lorem.words({ min: 3, max: 10 }),
            user: user,
            project: project,
          };
          await projectCommentRepository.insert(commentToInsert);
        }
      }
      console.log('ProjectDonation,projectComment seeded successfully');
    } catch (error) {
      console.error('Error seeding ProjectDonation,projectComment', error);
    }
    console.timeEnd('seed');
  }
}

import { Module } from '@nestjs/common';
import { ProjectResolver } from './project.resolver';
import { ProjectService } from './project.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Project } from './entity/project.entity';
import { ProjectImage } from '../projectImage/entity/projectImage.entity';
import { ProjectImageModule } from '../projectImage/projectImage.module';
import { CountryCodeModule } from '../countryCode/countryCode.module';
import { CountryCode } from '../countryCode/entity/countryCode.entity';
import { ProjectCategory } from '../projectCategory/entity/projectCategory.entity';
import { ProjectCategoryModule } from '../projectCategory/projectCategory.module';
import { UserModule } from '../user/user.module';
import { User } from '../user/entity/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Project,
      ProjectImage,
      CountryCode,
      ProjectCategory,
      User,
    ]),
    ProjectImageModule,
    CountryCodeModule,
    ProjectCategoryModule,
    UserModule,
  ],
  providers: [ProjectResolver, ProjectService],
})
export class ProjectModule {}

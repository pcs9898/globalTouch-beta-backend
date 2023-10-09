import { Module } from '@nestjs/common';
import { ProjectDonationResolver } from './projectDonation.resolver';
import { ProjectDonationService } from './projectDonation.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProjectDonation } from './entity/projectDonation.entity';
import { Project } from '../project/entity/project.entity';
import { ProjectModule } from '../project/project.module';
import { PortOneService } from '../portone/portone.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([ProjectDonation, Project]),
    ProjectModule,
  ],
  providers: [ProjectDonationResolver, ProjectDonationService, PortOneService],
})
export class ProjectDonationModule {}

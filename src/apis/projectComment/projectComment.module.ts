import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProjectComment } from './entity/projectComment.entity';
import { Project } from '../project/entity/project.entity';
import { ProjectCommentResolver } from './projectComment.resolver';
import { ProjectCommentService } from './projectComment.service';
import { ProjectModule } from '../project/project.module';
import { ProjectDonationModule } from '../projectDonation/projectDonation.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ProjectComment, Project]),
    ProjectModule,
    ProjectDonationModule,
  ],
  providers: [ProjectCommentService, ProjectCommentResolver],
  exports: [ProjectCommentService],
})
export class ProjectCommentModule {}

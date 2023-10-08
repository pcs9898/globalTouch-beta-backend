import { Module } from '@nestjs/common';
import { UpdatedProjectResolver } from './updatedProject.resolver';
import { UpdatedProjectService } from './updatedProject.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UpdatedProject } from './entity/updatedProject.entity';
import { Project } from '../project/entity/project.entity';
import { ProjectModule } from '../project/project.module';

@Module({
  imports: [TypeOrmModule.forFeature([UpdatedProject, Project]), ProjectModule],
  providers: [UpdatedProjectResolver, UpdatedProjectService],
})
export class UpdatedProjectModule {}

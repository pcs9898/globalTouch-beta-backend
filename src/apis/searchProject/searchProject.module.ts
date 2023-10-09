import { Module } from '@nestjs/common';
import { SearchProjectResolver } from './searchProject.resolver';
import { ProjectModule } from '../project/project.module';

@Module({
  imports: [ProjectModule],
  providers: [SearchProjectResolver],
})
export class SearchProjectModule {}

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProjectCategory } from './entity/projectCategory.entity';
import { ProjectCategoryService } from './projectCategory.service';

@Module({
  imports: [TypeOrmModule.forFeature([ProjectCategory])],
  providers: [ProjectCategoryService],
  exports: [ProjectCategoryService],
})
export class ProjectCategoryModule {}

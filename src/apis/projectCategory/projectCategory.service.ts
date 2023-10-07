import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProjectCategory } from './entity/projectCategory.entity';
import { Repository } from 'typeorm';
import { IProjectCategoryServiceFindOneProjectCategory } from './interfaces/projectCategory-service.interface';

@Injectable()
export class ProjectCategoryService {
  constructor(
    @InjectRepository(ProjectCategory)
    private readonly projectCategoryRepository: Repository<ProjectCategory>,
  ) {}

  async findOneProjectCategory({
    project_category,
  }: IProjectCategoryServiceFindOneProjectCategory) {
    return this.projectCategoryRepository.findOne({
      where: { project_category },
    });
  }
}

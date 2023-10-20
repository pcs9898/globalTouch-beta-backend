import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProjectImage } from './entity/projectImage.entity';
import { EntityManager, Repository } from 'typeorm';
import { IProjectImageServiceCreate } from './interfaces/projectImage-service.interface';

@Injectable()
export class ProjectImageService {
  constructor(
    @InjectRepository(ProjectImage)
    private readonly projectImageRepository: Repository<ProjectImage>,
  ) {}

  async create(
    { image_url, project, image_index }: IProjectImageServiceCreate,
    manager?: EntityManager,
  ): Promise<ProjectImage> {
    const repository = manager
      ? manager.getRepository(ProjectImage)
      : this.projectImageRepository;

    return await repository.save({
      image_url,
      project,
      image_index,
    });
  }
}

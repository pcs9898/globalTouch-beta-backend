import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UpdatedProject } from './entity/updatedProject.entity';
import { Repository } from 'typeorm';
import { ProjectService } from '../project/project.service';
import {
  IUpdatedProjectServiceCreateUpdatedProject,
  IUpdatedProjectServiceFetchUpdatedProjects,
} from './interfaces/updatedProject.interface';

@Injectable()
export class UpdatedProjectService {
  constructor(
    @InjectRepository(UpdatedProject)
    private readonly updatedProjectRepository: Repository<UpdatedProject>,

    private readonly projectService: ProjectService,
  ) {}

  // createUpdatedProject
  async createUpdatedProject({
    createUpdatedProjectDTO,
    context,
  }: IUpdatedProjectServiceCreateUpdatedProject): Promise<UpdatedProject> {
    const isProject = await this.projectService.findOneProjectById({
      project_id: createUpdatedProjectDTO.project_id,
      relationUser: true,
    });
    if (!isProject) throw new NotFoundException('Project not found');

    if (isProject.user.user_id !== context.req.user.user_id)
      throw new UnauthorizedException(
        'You do not have permission to write a updated project',
      );

    const updatedProject = await this.updatedProjectRepository.save({
      ...createUpdatedProjectDTO,
      project: isProject,
    });

    return updatedProject;
  }

  async fetchUpdatedProjects({
    project_id,
  }: IUpdatedProjectServiceFetchUpdatedProjects): Promise<UpdatedProject[]> {
    const isProject = await this.projectService.findOneProjectById({
      project_id,
    });
    if (!isProject) throw new NotFoundException('Project not found');

    const [updatedProjects] = await this.updatedProjectRepository.findAndCount({
      relations: ['project'],
      where: { project: { project_id: isProject.project_id } },
      order: { created_at: 'DESC' },
    });

    return updatedProjects;
  }
}

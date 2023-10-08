import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UpdatedProject } from './entity/updatedProject.entity';
import { Repository } from 'typeorm';
import { CreateUpdatedProjectResponseDTO } from './dto/create-updatedProject-response.dto';
import { ProjectService } from '../project/project.service';
import { IContext } from 'src/common/interfaces/context';
import { CreateUpdatedProjectDTO } from './dto/create-updatedProject.dto';
import { FetchUpdatedProjectsDTO } from './dto/fetch-updatedProjects.dto';
import { FetchUpdatedProjectsResponseDTO } from './dto/fetch-updatedProjects-response.dto';
import { plainToClass } from 'class-transformer';

export interface IUpdatedProjectServiceCreateUpdatedProject {
  createUpdatedProjectDTO: CreateUpdatedProjectDTO;
  context: IContext;
}

export interface IUpdatedProjectServiceFetchUpdatedProjects {
  fetchUpdatedProjectsDTO: FetchUpdatedProjectsDTO;
}

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
  }: IUpdatedProjectServiceCreateUpdatedProject): Promise<CreateUpdatedProjectResponseDTO> {
    const isProject = await this.projectService.findOneProjectById({
      project_id: createUpdatedProjectDTO.project_id,
      onlyUser: true,
    });
    if (!isProject) throw new NotFoundException('Project not found');

    if (isProject.user.user_id !== context.req.user.user_id)
      throw new UnauthorizedException(
        'You do not have permission to write a updated project',
      );

    await this.updatedProjectRepository.save({
      ...createUpdatedProjectDTO,
      project: isProject,
    });

    return { success: true };
  }

  async fetchUpdatedProjects({
    fetchUpdatedProjectsDTO,
  }: IUpdatedProjectServiceFetchUpdatedProjects): Promise<
    FetchUpdatedProjectsResponseDTO[]
  > {
    const isProject = await this.projectService.findOneProjectById({
      project_id: fetchUpdatedProjectsDTO.project_id,
    });
    if (!isProject) throw new NotFoundException('Project not found');

    const updatedProjects = await this.updatedProjectRepository.find({
      relations: ['project'],
      where: { project: { project_id: isProject.project_id } },
    });

    const plainUpdatedProjects = updatedProjects.map((updatedProject) =>
      plainToClass(FetchUpdatedProjectsResponseDTO, updatedProject),
    );

    return plainUpdatedProjects;
  }
}

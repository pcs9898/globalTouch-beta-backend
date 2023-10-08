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

export interface IUpdatedProjectServiceCreateUpdatedProject {
  createUpdatedProjectDTO: CreateUpdatedProjectDTO;
  context: IContext;
}

@Injectable()
export class UpdatedProjectService {
  constructor(
    @InjectRepository(UpdatedProject)
    private readonly updatedProjectRepository: Repository<UpdatedProject>,

    private readonly projectService: ProjectService,
  ) {}

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
}

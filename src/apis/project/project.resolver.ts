import { Args, Context, Mutation, Resolver } from '@nestjs/graphql';
import { ProjectService } from './project.service';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '../auth/guards/gql-auth.guard';
import { CreateProjectResponseDTO } from './dto/create-project-response.dto';
import { CreateProjectDTO } from './dto/create-project.dto';
import { IContext } from 'src/common/interfaces/context';

@Resolver()
export class ProjectResolver {
  constructor(private readonly projectService: ProjectService) {}

  @UseGuards(GqlAuthGuard('access'))
  @Mutation(() => CreateProjectResponseDTO)
  async createProject(
    @Args('createProjectDTO') createProjectDTO: CreateProjectDTO,
    @Context() context: IContext,
  ): Promise<CreateProjectResponseDTO> {
    return this.projectService.createProject({ createProjectDTO, context });
  }
}

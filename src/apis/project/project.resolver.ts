import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { ProjectService } from './project.service';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '../auth/guards/gql-auth.guard';
import { CreateProjectResponseDTO } from './dto/create-project-response.dto';
import { CreateProjectDTO } from './dto/create-project.dto';
import { IContext } from 'src/common/interfaces/context';
import { FetchProjectResponseDTO } from './dto/fetch-project-response.dto';
import { FetchProjectDTO } from './dto/fetch-project.dto';
import { FetchProjectsTrendingDTO } from './dto/fetch-projects-trending.dto';
import { FetchProjectsTrendingWithTotalResponseDTO } from './dto/fetch-projects-trending-withTotal-response.dto';

@Resolver()
export class ProjectResolver {
  constructor(private readonly projectService: ProjectService) {}

  @Query(() => FetchProjectResponseDTO)
  async fetchProject(
    @Args('fetchProjectDTO') fetchProjectDTO: FetchProjectDTO,
  ): Promise<FetchProjectResponseDTO> {
    return this.projectService.fetchProject({ fetchProjectDTO });
  }

  @Query(() => FetchProjectsTrendingWithTotalResponseDTO)
  async fetchProjectsTrending(
    @Args('fetchProjectsTrendingDTO')
    fetchProjectsTrendingDTO: FetchProjectsTrendingDTO,
  ): Promise<FetchProjectsTrendingWithTotalResponseDTO> {
    return this.projectService.fetchProjectsTrending({
      fetchProjectsTrendingDTO,
    });
  }

  @UseGuards(GqlAuthGuard('access'))
  @Mutation(() => CreateProjectResponseDTO)
  async createProject(
    @Args('createProjectDTO') createProjectDTO: CreateProjectDTO,
    @Context() context: IContext,
  ): Promise<CreateProjectResponseDTO> {
    return this.projectService.createProject({ createProjectDTO, context });
  }
}

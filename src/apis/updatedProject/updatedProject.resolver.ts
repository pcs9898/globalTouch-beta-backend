import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UpdatedProjectService } from './updatedProject.service';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '../auth/guards/gql-auth.guard';
import { CreateUpdatedProjectResponseDTO } from './dto/create-updatedProject-response.dto';
import { CreateUpdatedProjectDTO } from './dto/create-updatedProject.dto';
import { IContext } from 'src/common/interfaces/context';
import { FetchUpdatedProjectsResponseDTO } from './dto/fetch-updatedProjects-response.dto';
import { FetchUpdatedProjectsDTO } from './dto/fetch-updatedProjects.dto';

@Resolver()
export class UpdatedProjectResolver {
  constructor(private readonly updatedProjectService: UpdatedProjectService) {}

  @Query(() => [FetchUpdatedProjectsResponseDTO])
  async fetchUpdatedProjects(
    @Args('fetchUpdatedProjectsDTO')
    fetchUpdatedProjectsDTO: FetchUpdatedProjectsDTO,
  ): Promise<FetchUpdatedProjectsResponseDTO[]> {
    return this.updatedProjectService.fetchUpdatedProjects({
      fetchUpdatedProjectsDTO,
    });
  }

  @UseGuards(GqlAuthGuard('access'))
  @Mutation(() => CreateUpdatedProjectResponseDTO)
  async createUpdatedProject(
    @Args('createUpdatedProjectDTO')
    createUpdatedProjectDTO: CreateUpdatedProjectDTO,
    @Context() context: IContext,
  ): Promise<CreateUpdatedProjectResponseDTO> {
    return this.updatedProjectService.createUpdatedProject({
      createUpdatedProjectDTO,
      context,
    });
  }
}

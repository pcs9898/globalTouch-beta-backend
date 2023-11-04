import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UpdatedProjectService } from './updatedProject.service';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '../auth/guards/gql-auth.guard';
import { CreateUpdatedProjectDTO } from './dto/create-updatedProject.dto';
import { IContext } from 'src/common/interfaces/context';
import { UpdatedProject } from './entity/updatedProject.entity';

@Resolver()
export class UpdatedProjectResolver {
  constructor(private readonly updatedProjectService: UpdatedProjectService) {}

  @Query(() => [UpdatedProject])
  async fetchUpdatedProjects(
    @Args('project_id')
    project_id: string,
  ): Promise<UpdatedProject[]> {
    return this.updatedProjectService.fetchUpdatedProjects({
      project_id,
    });
  }

  @UseGuards(GqlAuthGuard('access'))
  @Mutation(() => UpdatedProject)
  async createUpdatedProject(
    @Args('createUpdatedProjectDTO')
    createUpdatedProjectDTO: CreateUpdatedProjectDTO,
    @Context() context: IContext,
  ): Promise<UpdatedProject> {
    return this.updatedProjectService.createUpdatedProject({
      createUpdatedProjectDTO,
      context,
    });
  }
}

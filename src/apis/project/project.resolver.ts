import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { ProjectService } from './project.service';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '../auth/guards/gql-auth.guard';
import { CreateProjectDTO } from './dto/create-project.dto';
import { IContext } from 'src/common/interfaces/context';
import { FetchProjectOgResponseDTO } from './dto/fetch-projectOg-response.dto';
import { Project } from './entity/project.entity';

import { FETCH_PROJECTS_ENUM } from 'src/common/interfaces/enum';

@Resolver()
export class ProjectResolver {
  constructor(private readonly projectService: ProjectService) {}

  @Query(() => Project)
  async fetchProject(@Args('project_id') project_id: string): Promise<Project> {
    return this.projectService.fetchProject({ project_id });
  }

  @Query(() => FetchProjectOgResponseDTO)
  async fetchProjectOg(
    @Args('project_id') project_id: string,
  ): Promise<FetchProjectOgResponseDTO> {
    return this.projectService.fetchProjectOg({ project_id });
  }

  @Query(() => [Project])
  async fetchProjects(
    @Args('fetchProjectsOption') fetchProjectsOption: FETCH_PROJECTS_ENUM,
    @Args('offset') offset: number,
  ): Promise<Project[]> {
    return this.projectService.fetchProjects({ fetchProjectsOption, offset });
  }

  @Query(() => [Project])
  async fetchProjectsByCountry(
    @Args('country_code') country_code: string,
    @Args('offset') offset: number,
  ): Promise<Project[]> {
    return this.projectService.fetchProjectsByCountry({
      country_code,
      offset,
    });
  }

  @UseGuards(GqlAuthGuard('access'))
  @Mutation(() => Project)
  async createProject(
    @Args('createProjectDTO') createProjectDTO: CreateProjectDTO,
    @Context() context: IContext,
  ): Promise<Project> {
    return this.projectService.createProject({ createProjectDTO, context });
  }
}

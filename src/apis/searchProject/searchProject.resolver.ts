import { Args, Query, Resolver } from '@nestjs/graphql';
import { ProjectService } from '../project/project.service';
import { Project } from '../project/entity/project.entity';

@Resolver()
export class SearchProjectResolver {
  constructor(private readonly projectService: ProjectService) {}

  @Query(() => [Project])
  async searchProjects(
    @Args('project_category') project_category: string,
    @Args('searchTerm') searchTerm: string,
    @Args('offset') offset: number,
  ): Promise<Project[]> {
    return this.projectService.searchProjects({
      project_category,
      searchTerm,
      offset,
    });
  }
}

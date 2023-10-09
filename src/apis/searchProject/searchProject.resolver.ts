import { Args, Query, Resolver } from '@nestjs/graphql';
import { ProjectService } from '../project/project.service';
import { SearchProjectWithTotalResponseDTO } from './dto/searchProjects/searchProject-withTotal-response.dto';
import { SearchProjectDTO } from './dto/searchProjects/searchProject.dto';

@Resolver()
export class SearchProjectResolver {
  constructor(private readonly projectService: ProjectService) {}

  @Query(() => SearchProjectWithTotalResponseDTO)
  async searchProjects(
    @Args('searchProjectsDTO') searchProjectsDTO: SearchProjectDTO,
  ): Promise<SearchProjectWithTotalResponseDTO> {
    return this.projectService.searchProjects({ searchProjectsDTO });
  }
}

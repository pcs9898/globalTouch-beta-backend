import { Args, Query, Resolver } from '@nestjs/graphql';
import { ProjectService } from '../project/project.service';
import { SearchProjectsWithTotalResponseDTO } from './dto/searchProjects/searchProjects-withTotal-response.dto';
import { SearchProjectsDTO } from './dto/searchProjects/searchProjects.dto';

@Resolver()
export class SearchProjectResolver {
  constructor(private readonly projectService: ProjectService) {}

  @Query(() => SearchProjectsWithTotalResponseDTO)
  async searchProjects(
    @Args('searchProjectsDTO') searchProjectsDTO: SearchProjectsDTO,
  ): Promise<SearchProjectsWithTotalResponseDTO> {
    return this.projectService.searchProjects({ searchProjectsDTO });
  }
}

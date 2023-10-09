import { IContext } from 'src/common/interfaces/context';
import { CreateUpdatedProjectDTO } from '../dto/create-updatedProject.dto';
import { FetchUpdatedProjectsDTO } from '../dto/fetch-updatedProjects.dto';

export interface IUpdatedProjectServiceCreateUpdatedProject {
  createUpdatedProjectDTO: CreateUpdatedProjectDTO;
  context: IContext;
}

export interface IUpdatedProjectServiceFetchUpdatedProjects {
  fetchUpdatedProjectsDTO: FetchUpdatedProjectsDTO;
}

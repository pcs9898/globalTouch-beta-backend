import { IContext } from 'src/common/interfaces/context';
import { CreateProjectDTO } from '../dto/create-project.dto';
import { FetchProjectDTO } from '../dto/fetch-project.dto';

export interface IProjectServiceCreateProject {
  createProjectDTO: CreateProjectDTO;
  context: IContext;
}

export interface IProjectServiceFetchProject {
  fetchProjectDTO: FetchProjectDTO;
}

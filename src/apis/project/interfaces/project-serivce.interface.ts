import { IContext } from 'src/common/interfaces/context';
import { CreateProjectDTO } from '../dto/create-project.dto';
import { FetchProjectDTO } from '../dto/fetch-project.dto';
import { FetchProjectsTrendingDTO } from '../dto/fetch-projects-trending/fetch-projects-trending.dto';
import { FetchProjectsUserLoggedInDTO } from '../dto/fetch-projects-user-loggedIn/fetch-projects-user-LoggedIn.dto';

export interface IProjectServiceCreateProject {
  createProjectDTO: CreateProjectDTO;
  context: IContext;
}

export interface IProjectServiceFetchProject {
  fetchProjectDTO: FetchProjectDTO;
}

export interface IProjectServiceFetchProjectsTrending {
  fetchProjectsTrendingDTO: FetchProjectsTrendingDTO;
}

export interface IProjectServiceFetchProjectsUserLoggedIn {
  fetchProjectsUserLoggedInDTO: FetchProjectsUserLoggedInDTO;
  context: IContext;
}

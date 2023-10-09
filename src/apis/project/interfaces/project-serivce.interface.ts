import { IContext } from 'src/common/interfaces/context';
import { CreateProjectDTO } from '../dto/create-project.dto';
import { FetchProjectDTO } from '../dto/fetch-project.dto';
import { FetchProjectsTrendingDTO } from '../dto/fetch-projects-trending/fetch-projects-trending.dto';
import { FetchProjectsNewestDTO } from '../dto/fetch-projects-newest/fetch-projects-newest.dto';
import { FetchProjectsByCountryDTO } from '../dto/fetch-projects-byCountry/fetch-projects-byCountry.dto';
import { Project } from '../entity/project.entity';
import { QueryRunner } from 'typeorm';
import { FetchUserLoggedInProjectsDTO } from 'src/apis/user/dto/fetch-user-loggedIn-projects/fetch-user-loggedIn-projects.dto';
import { SearchProjectsDTO } from 'src/apis/searchProject/dto/searchProjects/searchProjects.dto';

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
  fetchUserLoggedInProjectsDTO: FetchUserLoggedInProjectsDTO;
  context: IContext;
}

export interface IProjectServiceFetchProjectsNewest {
  fetchProjectsNewestDTO: FetchProjectsNewestDTO;
}

export interface IProjectServiceFetchProjectsByCountry {
  fetchProjectsByCountryDTO: FetchProjectsByCountryDTO;
}

export interface IProjectServiceFindOneProjectById {
  project_id: string;
  relationUser?: boolean;
}

export interface IProjectServiceFindOneWithWriteLock {
  project_id: string;
  queryRunner: QueryRunner;
}

export interface IProjectServiceSaveWithQueryRunner {
  project: Project;
  queryRunner: QueryRunner;
}

export interface IProjectServiceSearchProjects {
  searchProjectsDTO: SearchProjectsDTO;
}

import { IContext } from 'src/common/interfaces/context';
import { CreateProjectDTO } from '../dto/create-project.dto';
import { Project } from '../entity/project.entity';
import { QueryRunner } from 'typeorm';

import { FETCH_PROJECTS_ENUM } from 'src/common/interfaces/enum';

export interface IProjectServiceCreateProject {
  createProjectDTO: CreateProjectDTO;
  context: IContext;
}

export interface IProjectServiceFetchProject {
  project_id: string;
}

export interface IProjectServiceFetchProjects {
  fetchProjectsOption: FETCH_PROJECTS_ENUM;
  offset: number;
}

export interface IProjectServiceFetchProjectsUserLoggedIn {
  offset: number;
  context: IContext;
}

export interface IProjectServiceFetchProjectsByCountry {
  country_code: string;
  offset: number;
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
  project_category: string;
  searchTerm: string;

  offset: number;
}

export interface IProjectServiceFetchProjectOgDTO {
  project_id: string;
}

export interface IProjectServiceFetchMarkers {
  north: number;
  south: number;
  east: number;
  west: number;
}

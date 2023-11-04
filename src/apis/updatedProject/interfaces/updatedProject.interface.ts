import { IContext } from 'src/common/interfaces/context';
import { CreateUpdatedProjectDTO } from '../dto/create-updatedProject.dto';

export interface IUpdatedProjectServiceCreateUpdatedProject {
  createUpdatedProjectDTO: CreateUpdatedProjectDTO;
  context: IContext;
}

export interface IUpdatedProjectServiceFetchUpdatedProjects {
  project_id: string;
}

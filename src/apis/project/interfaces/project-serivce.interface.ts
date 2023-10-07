import { IContext } from 'src/common/interfaces/context';
import { CreateProjectDTO } from '../dto/create-project.dto';

export interface IProjectServiceCreateProject {
  createProjectDTO: CreateProjectDTO;
  context: IContext;
}

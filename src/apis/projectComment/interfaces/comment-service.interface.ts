import { IContext } from 'src/common/interfaces/context';
import { CreateProjectCommentDTO } from '../dto/create-projectComment.dto';
import { UpdateProjectCommentDTO } from '../dto/update-projectcomment.dto';
import { DeleteProjectCommentDTO } from '../dto/delete-projectcomment.dto';

export interface IProjectCommentServiceCreateProjectComment {
  createProjectCommentDTO: CreateProjectCommentDTO;
  context: IContext;
}

export interface IProjectCommentServiceFetchProjectComments {
  project_id: string;
  offset: number;
}

export interface IProjectServiceUpdateProjectComment {
  updateProjectCommentDTO: UpdateProjectCommentDTO;
  context: IContext;
}

export interface IProjectCommentServiceDeleteProjectComment {
  deleteProjectCommentDTO: DeleteProjectCommentDTO;
  context: IContext;
}

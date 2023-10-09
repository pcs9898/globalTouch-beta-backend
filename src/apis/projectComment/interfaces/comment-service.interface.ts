import { IContext } from 'src/common/interfaces/context';
import { CreateProjectCommentDTO } from '../dto/create-projectComment.dto';
import { FetchProjectCommentsDTO } from '../dto/fetch-projectComments/fetch-projectComments.dto';
import { UpdateProjectCommentDTO } from '../dto/update-projectcomment.dto';
import { DeleteProjectCommentDTO } from '../dto/delete-projectcomment.dto';

export interface IProjectCommentServiceCreateProjectComment {
  createProjectCommentDTO: CreateProjectCommentDTO;
  context: IContext;
}

export interface IProjectCommentServiceFetchProjectComments {
  fetchProjectCommentsDTO: FetchProjectCommentsDTO;
}

export interface IProjectServiceUpdateProjectComment {
  updateProjectCommentDTO: UpdateProjectCommentDTO;
  context: IContext;
}

export interface IProjectCommentServiceDeleteProjectComment {
  deleteProjectCommentDTO: DeleteProjectCommentDTO;
  context: IContext;
}

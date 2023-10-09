import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProjectComment } from './entity/projectComment.entity';
import { Repository } from 'typeorm';
import { IContext } from 'src/common/interfaces/context';
import { CreateProjectCommentDTO } from './dto/create-projectComment.dto';
import { ProjectService } from '../project/project.service';
import { ProjectDonationService } from '../projectDonation/projectDonation.service';
import { CreateProjectCommentResponseDTO } from './dto/create-projectComment-response.dto';

export interface IProjectCommentServiceCreateProjectComment {
  createProjectCommentDTO: CreateProjectCommentDTO;
  context: IContext;
}
@Injectable()
export class ProjectCommentService {
  constructor(
    @InjectRepository(ProjectComment)
    private readonly projectCommentRepository: Repository<ProjectComment>,

    private readonly projectService: ProjectService,

    private readonly projectDonationService: ProjectDonationService,
  ) {}

  async createProjectComment({
    createProjectCommentDTO,
    context,
  }: IProjectCommentServiceCreateProjectComment): Promise<CreateProjectCommentResponseDTO> {
    const isProject = await this.projectService.findOneProjectById({
      project_id: createProjectCommentDTO.project_id,
      relationUser: true,
    });
    if (!isProject) throw new NotFoundException('Project not found');

    if (isProject.user.user_id === context.req.user.user_id)
      throw new UnprocessableEntityException(
        'Cannot comment on your own project',
      );

    const isUserDonated = await this.projectDonationService.checkUserDonated({
      user_id: context.req.user.user_id,
      project_id: createProjectCommentDTO.project_id,
    });
    if (!isUserDonated)
      throw new UnauthorizedException(
        'Only those who have donated to this project can leave comments',
      );

    const isProjectComment = await this.projectCommentRepository.findOne({
      where: {
        project: { project_id: isProject.project_id },
        user: { user_id: context.req.user.user_id },
      },
    });
    if (isProjectComment)
      throw new UnprocessableEntityException('You can only leave one comment');

    const newProjectComment = await this.projectCommentRepository.save({
      ...createProjectCommentDTO,
      project: isProject,
      user: { user_id: context.req.user.user_id },
    });

    if (newProjectComment) return { success: true };
    else
      throw new InternalServerErrorException(
        'Failed to create a comment, please try again',
      );
  }
}

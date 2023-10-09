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
import { FetchProjectCommentsDTO } from './dto/fetch-projectComments/fetch-projectComments.dto';
import { FetchProjectCommentsWithTotalResponseDTO } from './dto/fetch-projectComments/fetch-projectComments-withTotal-response.dto';
import { plainToClass } from 'class-transformer';
import { FetchProjectCommentsResponseDTO } from './dto/fetch-projectComments/fetch-projectComments-response.dto';

export interface IProjectCommentServiceCreateProjectComment {
  createProjectCommentDTO: CreateProjectCommentDTO;
  context: IContext;
}

export interface IProjectCommentServiceFetchProjectComments {
  fetchProjectCommentsDTO: FetchProjectCommentsDTO;
}

@Injectable()
export class ProjectCommentService {
  constructor(
    @InjectRepository(ProjectComment)
    private readonly projectCommentRepository: Repository<ProjectComment>,

    private readonly projectService: ProjectService,

    private readonly projectDonationService: ProjectDonationService,
  ) {}

  private calculateMaxDonation(donations) {
    if (!donations.length) return null; // or any default value you want to return when there are no donations

    return Math.max(...donations.map((donation) => donation.amount));
  }

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

  async fetchProjectComments({
    fetchProjectCommentsDTO,
  }: IProjectCommentServiceFetchProjectComments): Promise<FetchProjectCommentsWithTotalResponseDTO> {
    const limit = 10;
    const [projectComments, total] =
      await this.projectCommentRepository.findAndCount({
        where: { project: { project_id: fetchProjectCommentsDTO.project_id } },
        skip: (fetchProjectCommentsDTO.offset - 1) * 4,
        take: limit,
        order: { created_at: 'DESC' },
        relations: ['user', 'user.projectDonations'],
      });

    const plainProjectComments = projectComments.map((projectComment) => {
      const plainComment = plainToClass(
        FetchProjectCommentsResponseDTO,
        projectComment,
      );
      plainComment.amount = this.calculateMaxDonation(
        plainComment.user.projectDonations,
      );
      return plainComment;
    });

    return {
      projectComments: plainProjectComments,
      total,
    };
  }
}

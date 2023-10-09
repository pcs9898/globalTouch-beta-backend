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
import { ProjectService } from '../project/project.service';
import { ProjectDonationService } from '../projectDonation/projectDonation.service';
import { CreateProjectCommentResponseDTO } from './dto/create-projectComment-response.dto';
import { FetchProjectCommentsWithTotalResponseDTO } from './dto/fetch-projectComments/fetch-projectComments-withTotal-response.dto';
import { plainToClass } from 'class-transformer';
import { FetchProjectCommentsResponseDTO } from './dto/fetch-projectComments/fetch-projectComments-response.dto';
import { UpdateProjectCommentResponseDTO } from './dto/update-projectComment-response.dto';
import {
  IProjectCommentServiceCreateProjectComment,
  IProjectCommentServiceFetchProjectComments,
  IProjectServiceUpdateProjectComment,
} from './interfaces/comment-service.interface';

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

  async updateProjectComment({
    updateProjectCommentDTO,
    context,
  }: IProjectServiceUpdateProjectComment): Promise<UpdateProjectCommentResponseDTO> {
    const isProject = await this.projectService.findOneProjectById({
      project_id: updateProjectCommentDTO.project_id,
    });
    if (!isProject) throw new NotFoundException('Project not found');

    const isProjectComment = await this.projectCommentRepository.findOne({
      where: {
        projectComment_id: updateProjectCommentDTO.projectComment_id,
      },
      relations: ['user'],
    });
    if (!isProjectComment)
      throw new UnprocessableEntityException(
        'Comment you are trying to update does not exist',
      );
    if (isProjectComment.user.user_id !== context.req.user.user_id)
      throw new UnauthorizedException('Can only edit your own comment');

    const updatedProjectComment = await this.projectCommentRepository.update(
      {
        projectComment_id: updateProjectCommentDTO.projectComment_id,
      },
      { content: updateProjectCommentDTO.content },
    );

    return { success: updatedProjectComment.affected > 0 ? true : false };
  }
}

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

import {
  IProjectCommentServiceCreateProjectComment,
  IProjectCommentServiceDeleteProjectComment,
  IProjectCommentServiceFetchProjectComments,
  IProjectServiceUpdateProjectComment,
} from './interfaces/comment-service.interface';
import { DeleteProjectCommentResponseDTO } from './dto/delete-projectComment-response.dto';

@Injectable()
export class ProjectCommentService {
  constructor(
    @InjectRepository(ProjectComment)
    private readonly projectCommentRepository: Repository<ProjectComment>,

    private readonly projectService: ProjectService,

    private readonly projectDonationService: ProjectDonationService,
  ) {}

  private calculateMaxDonation({ donations, project_id }) {
    if (!donations.length) return null; // or any default value you want to return when there are no donations

    // console.log(donations.project);

    // console.log(project_id);
    const filteredDonations = donations
      .filter((donation) => donation.project.project_id === project_id)
      .map((donation) => donation.amount);

    return Math.max(...filteredDonations);
  }

  private async checkProjectCommentOwner({ updateProjectCommentDTO, context }) {
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
  }

  async createProjectComment({
    createProjectCommentDTO,
    context,
  }: IProjectCommentServiceCreateProjectComment): Promise<ProjectComment> {
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

    const foundComment = await this.projectCommentRepository.findOne({
      where: { projectComment_id: newProjectComment.projectComment_id },
      relations: [
        'user',
        'user.projectDonations',
        'user.projectDonations.project',
      ],
    });

    foundComment.maxDonationAmount = this.calculateMaxDonation({
      donations: foundComment.user.projectDonations,
      project_id: createProjectCommentDTO.project_id,
    });

    if (foundComment) return foundComment;
    else
      throw new InternalServerErrorException(
        'Failed to create a comment, please try again',
      );
  }

  async fetchProjectComments({
    project_id,
    offset,
  }: IProjectCommentServiceFetchProjectComments): Promise<ProjectComment[]> {
    const limit = 10;

    const [projectComments] = await this.projectCommentRepository.findAndCount({
      where: { project: { project_id } },
      skip: (offset - 1) * limit,
      take: limit,
      order: { created_at: 'DESC' },
      relations: [
        'user',
        'user.projectDonations',
        'user.projectDonations.project',
      ],
    });

    const projectCommentsWithMaxAmountDonation = projectComments.map(
      (projectComment) => {
        projectComment.maxDonationAmount = this.calculateMaxDonation({
          donations: projectComment.user.projectDonations,
          project_id,
        });
        return projectComment;
      },
    );

    return projectCommentsWithMaxAmountDonation;
  }

  async updateProjectComment({
    updateProjectCommentDTO,
    context,
  }: IProjectServiceUpdateProjectComment): Promise<ProjectComment> {
    await this.checkProjectCommentOwner({ updateProjectCommentDTO, context });

    const updatedProjectComment = await this.projectCommentRepository.update(
      context.req.user.user_id,
      updateProjectCommentDTO,
    );

    if (updatedProjectComment.affected > 0) {
      const foundComment = await this.projectCommentRepository.findOne({
        where: { projectComment_id: updateProjectCommentDTO.projectComment_id },
        relations: ['user', 'user.projectDonations'],
      });

      foundComment.maxDonationAmount = this.calculateMaxDonation({
        donations: foundComment.user.projectDonations,
        project_id: updateProjectCommentDTO.project_id,
      });

      return foundComment;
    } else {
      throw new Error('Failed, try again plz');
    }
  }

  async deleteProjectComment({
    deleteProjectCommentDTO,
    context,
  }: IProjectCommentServiceDeleteProjectComment): Promise<DeleteProjectCommentResponseDTO> {
    await this.checkProjectCommentOwner({
      updateProjectCommentDTO: deleteProjectCommentDTO,
      context,
    });

    const deletedProjectComment =
      await this.projectCommentRepository.softDelete({
        projectComment_id: deleteProjectCommentDTO.projectComment_id,
      });

    return {
      success: deletedProjectComment.affected ? true : false,
    };
  }

  async checkUserCommented({ user_id, project_id }): Promise<ProjectComment> {
    return await this.projectCommentRepository.findOne({
      where: {
        user: { user_id },
        project: { project_id },
      },
    });
  }
}

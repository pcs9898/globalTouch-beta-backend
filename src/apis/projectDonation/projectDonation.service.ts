import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  PROJECT_DONATION_STATUS_ENUM,
  ProjectDonation,
} from './entity/projectDonation.entity';
import { DataSource, Repository } from 'typeorm';
import { CreateProjectDonationResponseDTO } from './dto/create-projectDonation-response.dto';
import { ProjectService } from '../project/project.service';
import {
  IProjectDonationServiceCreateProjectDonation,
  IProjectDonationServiceCreateProjectDonationForMobile,
  IProjectDonationServiceFetchProjectDonationsUserLoggedIn,
} from './interfaces/donation-service.interface';
import { PortOneService } from '../portone/portone.service';

@Injectable()
export class ProjectDonationService {
  constructor(
    @InjectRepository(ProjectDonation)
    private readonly projectDonationRepository: Repository<ProjectDonation>,

    private readonly projectService: ProjectService,

    private readonly dataSource: DataSource,

    private readonly portOneService: PortOneService,
  ) {}

  async createProjectDonation({
    createProjectDonationDTO,
    context,
  }: IProjectDonationServiceCreateProjectDonation): Promise<CreateProjectDonationResponseDTO> {
    await this.portOneService.checkDonated({
      imp_uid: createProjectDonationDTO.imp_uid,
      amount: createProjectDonationDTO.amount,
    });

    const isProjectDonation = await this.projectDonationRepository.findOne({
      where: {
        imp_uid: createProjectDonationDTO.imp_uid,
        status: PROJECT_DONATION_STATUS_ENUM.PAYMENT,
      },
    });
    if (isProjectDonation)
      throw new ConflictException('The donation is already registered');

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const project = await this.projectService.findOneWithWriteLock({
        project_id: createProjectDonationDTO.project_id,
        queryRunner,
      });
      if (!project) throw new NotFoundException('Project not found');
      if (project.user.user_id === context.req.user.user_id)
        throw new UnprocessableEntityException('Self-donation is not allowed');

      await queryRunner.manager.save(ProjectDonation, {
        ...createProjectDonationDTO,
        status: PROJECT_DONATION_STATUS_ENUM.PAYMENT,
        user: context.req.user,
        project,
      });

      project.amount_raised += createProjectDonationDTO.amount;
      project.donation_count += 1;

      const updatedProject = await this.projectService.saveWithQueryRunner({
        project,
        queryRunner,
      });

      await queryRunner.commitTransaction();

      if (updatedProject) return { success: true };
      else
        throw new UnprocessableEntityException(
          'An error occurred during the donation process',
        );
    } catch (error) {
      await queryRunner.rollbackTransaction();

      throw error;
    } finally {
      queryRunner.release();
    }
  }

  async createProjectDonationForMobile({
    createProjectDonationForMobileDTO,
    context,
  }: IProjectDonationServiceCreateProjectDonationForMobile): Promise<CreateProjectDonationResponseDTO> {
    const amount = await this.portOneService.checkDonatedAmount({
      imp_uid: createProjectDonationForMobileDTO.imp_uid,
    });

    const isProjectDonation = await this.projectDonationRepository.findOne({
      where: {
        imp_uid: createProjectDonationForMobileDTO.imp_uid,
        status: PROJECT_DONATION_STATUS_ENUM.PAYMENT,
      },
    });
    if (isProjectDonation)
      throw new ConflictException('The donation is already registered');

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const project = await this.projectService.findOneWithWriteLock({
        project_id: createProjectDonationForMobileDTO.project_id,
        queryRunner,
      });
      if (!project) throw new NotFoundException('Project not found');
      if (project.user.user_id === context.req.user.user_id)
        throw new UnprocessableEntityException('Self-donation is not allowed');

      await queryRunner.manager.save(ProjectDonation, {
        ...createProjectDonationForMobileDTO,
        status: PROJECT_DONATION_STATUS_ENUM.PAYMENT,
        user: context.req.user,
        project,
        amount,
      });

      project.amount_raised += amount;
      project.donation_count += 1;

      const updatedProject = await this.projectService.saveWithQueryRunner({
        project,
        queryRunner,
      });

      await queryRunner.commitTransaction();

      if (updatedProject) return { success: true };
      else
        throw new UnprocessableEntityException(
          'An error occurred during the donation process',
        );
    } catch (error) {
      await queryRunner.rollbackTransaction();

      throw error;
    } finally {
      queryRunner.release();
    }
  }

  async fetchProjectDonationsUserLoggedIn({
    offset,
    context,
  }: IProjectDonationServiceFetchProjectDonationsUserLoggedIn): Promise<
    ProjectDonation[]
  > {
    const limit = 8;
    const [projectsDonationsUserLoggedIn] =
      await this.projectDonationRepository.findAndCount({
        where: {
          user: { user_id: context.req.user.user_id },
        },
        skip: (offset - 1) * limit,
        take: limit,
        order: { created_at: 'DESC' },
        relations: ['project', 'project.countryCode', 'project.projectImages'],
      });

    return projectsDonationsUserLoggedIn;
  }

  async checkUserDonated({ user_id, project_id }): Promise<ProjectDonation> {
    return await this.projectDonationRepository.findOne({
      where: {
        user: { user_id },
        project: { project_id },
        status: PROJECT_DONATION_STATUS_ENUM.PAYMENT,
      },
    });
  }
}

import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Project } from './entity/project.entity';
import { DataSource, Repository } from 'typeorm';
import { CreateProjectResponseDTO } from './dto/create-project-response.dto';
import { ProjectImageService } from '../projectImage/projectImage.service';
import { CountryCodeService } from '../countryCode/countryCode.service';
import { ProjectCategoryService } from '../projectCategory/projectCategory.service';
import { plainToClass } from 'class-transformer';
import { UserService } from '../user/user.service';
import {
  IProjectServiceCreateProject,
  IProjectServiceFetchProject,
  IProjectServiceFetchProjectsTrending,
} from './interfaces/project-serivce.interface';
import { FetchProjectResponseDTO } from './dto/fetch-project-response.dto';
import { FetchProjectsTrendingResponseDTO } from './dto/fetch-projects-trending-response.dto';
import { FetchProjectsTrendingWithTotalResponseDTO } from './dto/fetch-projects-trending-withTotal-response.dto';

@Injectable()
export class ProjectService {
  constructor(
    @InjectRepository(Project)
    private readonly projectRepository: Repository<Project>,

    private readonly projectImageService: ProjectImageService,

    private readonly countryCodeService: CountryCodeService,

    private readonly projectCategoryService: ProjectCategoryService,

    private readonly userService: UserService,

    private readonly dataSource: DataSource,
  ) {}

  // createProject
  async createProject({
    createProjectDTO,
    context,
  }: IProjectServiceCreateProject): Promise<CreateProjectResponseDTO> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const isProject = await queryRunner.manager.findOne(Project, {
        where: { title: createProjectDTO.title },
      });
      if (isProject)
        throw new ConflictException(
          'Project title already exists. Please choose a different title.',
        );

      const isProjectCategory =
        await this.projectCategoryService.findOneProjectCategory({
          project_category: createProjectDTO.project_category,
        });
      if (!isProjectCategory)
        throw new UnprocessableEntityException('Invalid project category');

      const user = await this.userService.findOneUserById({
        user_id: context.req.user.user_id,
      });

      const projectImageUrls = createProjectDTO.projectImageUrls.match(
        /(https?:\/\/[^\s]+?\.jpg)(?=(https?:\/\/)|$)/g,
      );
      if (!projectImageUrls)
        throw new UnprocessableEntityException('At least 1 photo is required');
      if (projectImageUrls.length > 3)
        throw new UnprocessableEntityException('Maximum of 3 photos allowed');

      const newProject = await queryRunner.manager.save(Project, {
        ...createProjectDTO,
        countryCode: user.countryCode,
        projectCategory: isProjectCategory,
        user,
      });

      const projectImagesCreate = await projectImageUrls.map((image_url) =>
        this.projectImageService.create(
          {
            project: newProject,
            image_url,
          },
          queryRunner.manager,
        ),
      );

      const projectImagesResult = await Promise.all(projectImagesCreate);

      await queryRunner.commitTransaction();

      return plainToClass(CreateProjectResponseDTO, {
        ...newProject,
        project_category: isProjectCategory,
        projectImages: projectImagesResult,
      });
    } catch (error) {
      await queryRunner.rollbackTransaction();

      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  // fetchProject
  async fetchProject({
    fetchProjectDTO,
  }: IProjectServiceFetchProject): Promise<FetchProjectResponseDTO> {
    const isProject = await this.projectRepository.findOne({
      where: { project_id: fetchProjectDTO.project_id },
      relations: ['user', 'projectCategory', 'countryCode', 'projectImages'],
    });
    if (!isProject) throw new NotFoundException('Project not found');

    return plainToClass(FetchProjectResponseDTO, isProject);
  }

  // fetchProjectsTrending
  async fetchProjectsTrending({
    fetchProjectsTrendingDTO,
  }: IProjectServiceFetchProjectsTrending): Promise<FetchProjectsTrendingWithTotalResponseDTO> {
    const limit = 4;
    const [trendingProjects, total] = await this.projectRepository.findAndCount(
      {
        skip: (fetchProjectsTrendingDTO.offset - 1) * limit,
        take: limit,
        order: { donation_count: 'DESC' },
        relations: ['countryCode', 'projectImages'],
      },
    );

    const plainTrendingProjects = trendingProjects.map((trendingProject) =>
      plainToClass(FetchProjectsTrendingResponseDTO, trendingProject),
    );

    return {
      ProjectsTrending: plainTrendingProjects,
      total,
    };
  }
}

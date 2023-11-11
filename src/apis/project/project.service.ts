import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Project } from './entity/project.entity';
import { DataSource, Like, Repository } from 'typeorm';
import { ProjectImageService } from '../projectImage/projectImage.service';
import { CountryCodeService } from '../countryCode/countryCode.service';
import { ProjectCategoryService } from '../projectCategory/projectCategory.service';
import { plainToClass } from 'class-transformer';
import {
  IProjectServiceCreateProject,
  IProjectServiceFetchMarkers,
  IProjectServiceFetchProject,
  IProjectServiceFetchProjectOgDTO,
  IProjectServiceFetchProjects,
  IProjectServiceFetchProjectsByCountry,
  IProjectServiceFetchProjectsUserLoggedIn,
  IProjectServiceFindOneProjectById,
  IProjectServiceFindOneWithWriteLock,
  IProjectServiceSaveWithQueryRunner,
  IProjectServiceSearchProjects,
} from './interfaces/project-serivce.interface';
import { CommonService } from '../common/common.service';
import { FetchProjectOgResponseDTO } from './dto/fetch-projectOg-response.dto';
import { FETCH_PROJECTS_ENUM } from 'src/common/interfaces/enum';

@Injectable()
export class ProjectService {
  constructor(
    @InjectRepository(Project)
    private readonly projectRepository: Repository<Project>,

    private readonly projectImageService: ProjectImageService,

    private readonly countryCodeService: CountryCodeService,

    private readonly projectCategoryService: ProjectCategoryService,

    private readonly dataSource: DataSource,

    private readonly commonService: CommonService,
  ) {}

  // createProject
  async createProject({
    createProjectDTO,
    context,
  }: IProjectServiceCreateProject): Promise<Project> {
    const isProject = await this.projectRepository.findOne({
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

    const isCountryCode = await this.countryCodeService.findOneCountryCode({
      country_code: createProjectDTO.countryCode,
    });
    if (!isCountryCode)
      throw new UnprocessableEntityException('Invalid country Code');

    const user = await this.commonService.findOneUserById({
      user_id: context.req.user.user_id,
      onlyUser: true,
    });

    const splitUrls = createProjectDTO.projectImageUrls
      .split('https://')
      .filter(Boolean);
    const projectImageUrls = splitUrls.map((part) => 'https://' + part);

    if (!projectImageUrls)
      throw new UnprocessableEntityException('At least 1 photo is required');
    if (projectImageUrls.length > 3)
      throw new UnprocessableEntityException('Maximum of 3 photos allowed');

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const newProject = await queryRunner.manager.save(Project, {
        ...createProjectDTO,
        location: `POINT(${createProjectDTO.lat} ${createProjectDTO.lng})`,
        projectCategory: isProjectCategory,
        countryCode: isCountryCode,
        user,
      });

      const projectImagesCreate = await projectImageUrls.map((image_url, i) =>
        this.projectImageService.create(
          {
            project: newProject,
            image_url,
            image_index: i,
          },
          queryRunner.manager,
        ),
      );

      await Promise.all(projectImagesCreate);

      await queryRunner.commitTransaction();

      const foundProject = await this.projectRepository.findOne({
        where: { project_id: newProject.project_id },
        relations: ['countryCode', 'projectImages', 'projectCategory'],
      });
      return foundProject;
    } catch (error) {
      await queryRunner.rollbackTransaction();

      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  // fetchProject
  async fetchProject({
    project_id,
  }: IProjectServiceFetchProject): Promise<Project> {
    const isProject = await this.projectRepository.findOne({
      where: { project_id },
      relations: ['user', 'projectCategory', 'countryCode', 'projectImages'],
    });
    if (!isProject) throw new NotFoundException('Project not found');

    return isProject;
  }

  async fetchProjectOg({
    project_id,
  }: IProjectServiceFetchProjectOgDTO): Promise<FetchProjectOgResponseDTO> {
    const isProject = await this.findOneProjectById({
      project_id,
    });

    if (!isProject) throw new NotFoundException('Project not found');

    return plainToClass(FetchProjectOgResponseDTO, isProject);
  }

  async fetchProjects({
    fetchProjectsOption,
    offset,
  }: IProjectServiceFetchProjects): Promise<Project[]> {
    const limit = 8;

    if (fetchProjectsOption === FETCH_PROJECTS_ENUM.Trending) {
      const [trendingProjects] = await this.projectRepository.findAndCount({
        skip: (offset - 1) * limit,
        take: limit,
        order: { donation_count: 'DESC' },
        relations: ['countryCode', 'projectImages', 'projectCategory'],
      });
      return trendingProjects;
    } else {
      const [projectsNewest] = await this.projectRepository.findAndCount({
        skip: (offset - 1) * limit,
        take: limit,
        order: { created_at: 'DESC' },
        relations: ['countryCode', 'projectImages', 'projectCategory'],
      });

      return projectsNewest;
    }
  }

  async fetchMarkers({
    north,
    south,
    east,
    west,
  }: IProjectServiceFetchMarkers) {
    return await this.projectRepository
      .createQueryBuilder('project')
      .leftJoinAndSelect('project.projectCategory', 'projectCategory')
      .leftJoinAndSelect('project.countryCode', 'countryCode')
      .leftJoinAndSelect('project.projectImages', 'projectImages')
      .where('ST_Within(project.location, ST_GeomFromText(:bounds,4326))', {
        bounds: `POLYGON((${north} ${west}, ${north} ${east}, ${south} ${east}, ${south} ${west}, ${north} ${west}))`,
      })
      .getMany();
  }

  // fetchProjectsUserLoggedIn
  async fetchProjectsUserLoggedIn({
    offset,
    context,
  }: IProjectServiceFetchProjectsUserLoggedIn): Promise<Project[]> {
    const limit = 8;

    console.log(context.req.user);
    const [projectsUserLoggedIn] = await this.projectRepository.findAndCount({
      where: { user: context.req.user },
      skip: (offset - 1) * limit,
      take: limit,
      order: { created_at: 'DESC' },
      relations: ['countryCode', 'projectImages'],
    });

    return projectsUserLoggedIn;
  }

  // fetchProjectsByCountry
  async fetchProjectsByCountry({
    country_code,
    offset,
  }: IProjectServiceFetchProjectsByCountry): Promise<Project[]> {
    const limit = 8;

    const isCountryCode = await this.countryCodeService.findOneCountryCode({
      country_code,
    });
    if (!isCountryCode)
      throw new UnprocessableEntityException('Invalid Country Code');

    const [projectsByCountry] = await this.projectRepository.findAndCount({
      where: {
        countryCode: isCountryCode,
      },
      skip: (offset - 1) * limit,
      take: limit,
      order: { created_at: 'DESC' },
      relations: ['countryCode', 'projectImages'],
    });

    return projectsByCountry;
  }

  async searchProjects({
    project_category,
    searchTerm,
    offset,
  }: IProjectServiceSearchProjects): Promise<Project[]> {
    const limit = 8;
    let searchedProjects;

    if (project_category === 'All') {
      [searchedProjects] = await this.projectRepository.findAndCount({
        where: {
          title: Like(`%${searchTerm}%`),
        },
        skip: (offset - 1) * limit,
        take: limit,
        order: { created_at: 'DESC' },
        relations: ['countryCode', 'projectImages'],
      });
      return searchedProjects;
    } else {
      [searchedProjects] = await this.projectRepository.findAndCount({
        where: {
          title: Like(`%${searchTerm}%`),
          projectCategory: {
            project_category: project_category,
          },
        },
        skip: (offset - 1) * limit,
        take: limit,
        order: { created_at: 'DESC' },
        relations: ['countryCode', 'projectImages'],
      });
      return searchedProjects;
    }
  }

  // findOneProjectById
  async findOneProjectById({
    project_id,
    relationUser,
  }: IProjectServiceFindOneProjectById) {
    if (relationUser) {
      return await this.projectRepository.findOne({
        where: { project_id },
        relations: ['user'],
      });
    }
    return await this.projectRepository.findOne({
      where: { project_id },
    });
  }

  // findOneWithWriteLock
  async findOneWithWriteLock({
    project_id,
    queryRunner,
  }: IProjectServiceFindOneWithWriteLock): Promise<Project> {
    return await queryRunner.manager.findOne(Project, {
      where: { project_id },
      relations: ['user'],
      lock: { mode: 'pessimistic_write' },
    });
  }

  // saveWithQueryRunner
  async saveWithQueryRunner({
    project,
    queryRunner,
  }: IProjectServiceSaveWithQueryRunner): Promise<Project> {
    return await queryRunner.manager.save(project);
  }
}

import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Project } from './entity/project.entity';
import { DataSource, Like, Repository } from 'typeorm';
import { CreateProjectResponseDTO } from './dto/create-project-response.dto';
import { ProjectImageService } from '../projectImage/projectImage.service';
import { CountryCodeService } from '../countryCode/countryCode.service';
import { ProjectCategoryService } from '../projectCategory/projectCategory.service';
import { plainToClass } from 'class-transformer';
import {
  IProjectServiceCreateProject,
  IProjectServiceFetchProject,
  IProjectServiceFetchProjectsByCountry,
  IProjectServiceFetchProjectsNewest,
  IProjectServiceFetchProjectsTrending,
  IProjectServiceFetchProjectsUserLoggedIn,
  IProjectServiceFindOneProjectById,
  IProjectServiceFindOneWithWriteLock,
  IProjectServiceSaveWithQueryRunner,
  IProjectServiceSearchProjects,
} from './interfaces/project-serivce.interface';
import { FetchProjectResponseDTO } from './dto/fetch-project-response.dto';
import { FetchProjectsTrendingResponseDTO } from './dto/fetch-projects-trending/fetch-projects-trending-response.dto';
import { FetchProjectsTrendingWithTotalResponseDTO } from './dto/fetch-projects-trending/fetch-projects-trending-withTotal-response.dto';
import { FetchProjectsUserLoggedInResponseDTO } from './dto/fetch-projects-user-loggedIn/fetch-projects-user-LoggedIn-response.dto';
import { FetchProjectsNewestWithTotalResponseDTO } from './dto/fetch-projects-newest/fetch-projects-newest-withTotal-response.dto';
import { FetchProjectsNewestResponseDTO } from './dto/fetch-projects-newest/fetch-projects-newest-reponse.dto';
import { FetchProjectsByCountryWithTotalResponseDTO } from './dto/fetch-projects-byCountry/fetch-projects-byCountry-withTotal-response.dto';
import { FetchProjectsByCountryResponseDTO } from './dto/fetch-projects-byCountry/fetch-projects-byCountry-response.dto';
import { FetchUserLoggedInProjectsWithTotalResponseDTO } from '../user/dto/fetch-user-loggedIn-projects/fetch-user-loggedIn-projects-withTotal-response.dto';
import { CommonService } from '../common/common.service';
import { SearchProjectWithTotalResponseDTO } from '../searchProject/dto/searchProjects/searchProject-withTotal-response.dto';
import { SearchProjectResponseDTO } from '../searchProject/dto/searchProjects/searchProject-response.dto';

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
  }: IProjectServiceCreateProject): Promise<CreateProjectResponseDTO> {
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

    const user = await this.commonService.findOneUserById({
      user_id: context.req.user.user_id,
    });

    const projectImageUrls = createProjectDTO.projectImageUrls.match(
      /(https?:\/\/[^\s]+?\.jpg)(?=(https?:\/\/)|$)/g,
    );
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
    const limit = 8;
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
      projectsTrending: plainTrendingProjects,
      total,
    };
  }

  // fetchProjectsUserLoggedIn
  async fetchProjectsUserLoggedIn({
    fetchUserLoggedInProjectsDTO,
    context,
  }: IProjectServiceFetchProjectsUserLoggedIn): Promise<FetchUserLoggedInProjectsWithTotalResponseDTO> {
    const limit = 8;
    const [projectsUserLoggedIn, total] =
      await this.projectRepository.findAndCount({
        where: { user: context.req.user },
        skip: (fetchUserLoggedInProjectsDTO.offset - 1) * limit,
        take: limit,
        order: { created_at: 'DESC' },
        relations: ['countryCode', 'projectImages'],
      });

    const plainProjectsUserLoggedIn = projectsUserLoggedIn.map(
      (projectUserLoggedIn) =>
        plainToClass(FetchProjectsUserLoggedInResponseDTO, projectUserLoggedIn),
    );

    return {
      projectsUserLoggedIn: plainProjectsUserLoggedIn,
      total,
    };
  }

  // fetchProjectsNewest
  async fetchProjectsNewest({
    fetchProjectsNewestDTO,
  }: IProjectServiceFetchProjectsNewest): Promise<FetchProjectsNewestWithTotalResponseDTO> {
    const limit = 8;
    const [projectsNewest, total] = await this.projectRepository.findAndCount({
      skip: (fetchProjectsNewestDTO.offset - 1) * limit,
      take: limit,
      order: { created_at: 'DESC' },
      relations: ['countryCode', 'projectImages'],
    });

    const plainProjectsNewest = projectsNewest.map((projectNewest) =>
      plainToClass(FetchProjectsNewestResponseDTO, projectNewest),
    );

    return {
      projectsNewest: plainProjectsNewest,
      total,
    };
  }

  // fetchProjectsByCountry
  async fetchProjectsByCountry({
    fetchProjectsByCountryDTO,
  }: IProjectServiceFetchProjectsByCountry): Promise<FetchProjectsByCountryWithTotalResponseDTO> {
    const limit = 8;

    const isCountryCode = await this.countryCodeService.findOneCountryCode({
      country_code: fetchProjectsByCountryDTO.country_code,
    });
    if (!isCountryCode)
      throw new UnprocessableEntityException('Invalid Country Code');

    const [projectsByCountry, total] =
      await this.projectRepository.findAndCount({
        where: {
          countryCode: isCountryCode,
        },
        skip: (fetchProjectsByCountryDTO.offset - 1) * limit,
        take: limit,
        order: { created_at: 'DESC' },
        relations: ['countryCode', 'projectImages'],
      });

    const plainProjectsByCountry = projectsByCountry.map((projectByCountry) =>
      plainToClass(FetchProjectsByCountryResponseDTO, projectByCountry),
    );

    return {
      projectsByCountry: plainProjectsByCountry,
      total,
    };
  }

  async searchProjects({
    searchProjectsDTO,
  }: IProjectServiceSearchProjects): Promise<SearchProjectWithTotalResponseDTO> {
    const limit = 8;
    let searchedProjects;
    let total;

    if (searchProjectsDTO.project_category === 'All') {
      [searchedProjects, total] = await this.projectRepository.findAndCount({
        where: {
          title: Like(`%${searchProjectsDTO.searchTerm}%`),
        },
        skip: (searchProjectsDTO.offset - 1) * limit,
        take: limit,
        order: { created_at: 'DESC' },
        relations: ['countryCode', 'projectImages'],
      });
    } else {
      [searchedProjects, total] = await this.projectRepository.findAndCount({
        where: {
          title: Like(`%${searchProjectsDTO.searchTerm}%`),
          projectCategory: {
            project_category: searchProjectsDTO.project_category,
          },
        },
        skip: (searchProjectsDTO.offset - 1) * limit,
        take: limit,
        order: { created_at: 'DESC' },
        relations: ['countryCode', 'projectImages'],
      });
    }

    const plainSearchedProjects = searchedProjects.map((searchedProject) =>
      plainToClass(SearchProjectResponseDTO, searchedProject),
    );

    return {
      searchProjects: plainSearchedProjects,
      total,
    };
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

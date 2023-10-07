import {
  ConflictException,
  Injectable,
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
import { IProjectServiceCreateProject } from './interfaces/project-serivce.interface';

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

      const isCountryCode = await this.countryCodeService.findOneCountryCode({
        country_code: createProjectDTO.country_code,
      });
      if (!isCountryCode)
        throw new UnprocessableEntityException('Invalid country code');

      const isProjectCategory =
        await this.projectCategoryService.findOneProjectCategory({
          project_category: createProjectDTO.project_category,
        });
      if (!isProjectCategory)
        throw new UnprocessableEntityException('Invalid project category');

      const user = await this.userService.findOneUserById({
        user_id: context.req.user.user_id,
        onlyUser: true,
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
        countryCode: isCountryCode,
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
        country_code: isCountryCode,
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
}

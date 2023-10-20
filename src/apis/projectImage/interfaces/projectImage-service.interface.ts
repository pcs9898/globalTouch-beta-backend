import { Project } from 'src/apis/project/entity/project.entity';

export interface IProjectImageServiceCreate {
  image_url: string;
  project: Project;
  image_index: number;
}

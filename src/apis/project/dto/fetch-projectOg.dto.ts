import { InputType, PickType } from '@nestjs/graphql';
import { Project } from '../entity/project.entity';

@InputType()
export class FetchProjectOgDTO extends PickType(
  Project,
  ['project_id'],
  InputType,
) {}

import { ObjectType, PickType } from '@nestjs/graphql';
import { Project } from '../entity/project.entity';

@ObjectType()
export class FetchProjectOgResponseDTO extends PickType(Project, [
  'title',
  'content',
] as const) {}

import { ObjectType, PickType } from '@nestjs/graphql';
import { UpdatedProject } from '../entity/updatedProject.entity';

@ObjectType()
export class FetchUpdatedProjectsResponseDTO extends PickType(
  UpdatedProject,
  ['content', 'created_at'] as const,
  ObjectType,
) {}

import { ObjectType, PickType } from '@nestjs/graphql';
import { ProjectComment } from '../entity/projectComment.entity';

@ObjectType()
export class CreateProjectCommentResponseDTO extends PickType(
  ProjectComment,
  ['content', 'created_at', 'projectComment_id', 'user'] as const,
  ObjectType,
) {}

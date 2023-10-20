import { Field, Int, ObjectType, PickType } from '@nestjs/graphql';
import { ProjectComment } from '../../entity/projectComment.entity';

@ObjectType()
export class FetchProjectCommentsResponseDTO extends PickType(
  ProjectComment,
  ['content', 'user', 'projectComment_id'] as const,
  ObjectType,
) {
  @Field(() => Int)
  amount: number;
}

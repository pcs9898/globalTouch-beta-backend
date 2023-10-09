import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class DeleteProjectCommentResponseDTO {
  @Field(() => Boolean)
  success: boolean;
}

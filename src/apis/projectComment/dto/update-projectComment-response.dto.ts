import { Field, ObjectType } from '@nestjs/graphql';
import { IsBoolean, IsNotEmpty } from 'class-validator';

@ObjectType()
export class UpdateProjectCommentResponseDTO {
  @Field(() => Boolean)
  @IsNotEmpty()
  @IsBoolean()
  success: boolean;
}

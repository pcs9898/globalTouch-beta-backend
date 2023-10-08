import { Field, InputType, PickType } from '@nestjs/graphql';
import { ProjectComment } from '../entity/projectComment.entity';
import { IsNotEmpty, IsString } from 'class-validator';

@InputType()
export class CreateProjectCommentDTO extends PickType(
  ProjectComment,
  ['content'] as const,
  InputType,
) {
  @Field(() => String, { nullable: false })
  @IsNotEmpty()
  @IsString()
  project_id: string;
}

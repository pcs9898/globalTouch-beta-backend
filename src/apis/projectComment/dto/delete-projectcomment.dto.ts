import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsString } from 'class-validator';

@InputType()
export class DeleteProjectCommentDTO {
  @Field(() => String, { nullable: false })
  @IsNotEmpty()
  @IsString()
  project_id: string;

  @Field(() => String, { nullable: false })
  @IsNotEmpty()
  @IsString()
  projectComment_id: string;
}

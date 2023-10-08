import { Field, InputType, PickType } from '@nestjs/graphql';
import { Project } from '../entity/project.entity';
import { IsNotEmpty, IsString, Length } from 'class-validator';

@InputType()
export class CreateProjectDTO extends PickType(
  Project,
  ['title', 'amount_required', 'content'] as const,
  InputType,
) {
  @Field(() => String)
  @IsNotEmpty()
  @IsString()
  @Length(1, 30)
  project_category: string;

  @Field(() => String, { nullable: false })
  @IsNotEmpty()
  @IsString()
  projectImageUrls: string;
}

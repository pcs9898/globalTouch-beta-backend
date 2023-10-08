import { Field, InputType, PickType } from '@nestjs/graphql';
import { UpdatedProject } from '../entity/updatedProject.entity';
import { IsNotEmpty, IsString } from 'class-validator';

@InputType()
export class CreateUpdatedProjectDTO extends PickType(
  UpdatedProject,
  ['content'] as const,
  InputType,
) {
  @Field(() => String, { nullable: false })
  @IsNotEmpty()
  @IsString()
  project_id: string;
}

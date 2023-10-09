import { Field, InputType, PickType, registerEnumType } from '@nestjs/graphql';
import { Project } from '../entity/project.entity';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { PROJECT_CATEGORY_ENUM } from 'src/common/interfaces/enum';

registerEnumType(PROJECT_CATEGORY_ENUM, {
  name: 'PROJECT_CATEGORY_ENUM',
});

@InputType()
export class CreateProjectDTO extends PickType(
  Project,
  ['title', 'amount_required', 'content'] as const,
  InputType,
) {
  @Field(() => PROJECT_CATEGORY_ENUM, {
    defaultValue: 'Medical',
    nullable: false,
  })
  @IsNotEmpty()
  @IsEnum(PROJECT_CATEGORY_ENUM)
  project_category: string;

  @Field(() => String, { nullable: false })
  @IsNotEmpty()
  @IsString()
  projectImageUrls: string;
}

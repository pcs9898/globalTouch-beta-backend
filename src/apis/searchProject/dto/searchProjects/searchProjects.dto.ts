import { Field, InputType, Int, registerEnumType } from '@nestjs/graphql';
import { IsEnum, IsInt, IsNotEmpty, IsString, Min } from 'class-validator';
import { PROJECT_CATEGORY_WITH_ALL_ENUM } from 'src/common/interfaces/enum';

registerEnumType(PROJECT_CATEGORY_WITH_ALL_ENUM, {
  name: 'PROJECT_CATEGORY_WITH_ALL_ENUM',
});

@InputType()
export class SearchProjectsDTO {
  @Field(() => String, { nullable: false })
  @IsNotEmpty()
  @IsString()
  searchTerm: string;

  @Field(() => PROJECT_CATEGORY_WITH_ALL_ENUM, {
    defaultValue: 'All',
    nullable: false,
  })
  @IsNotEmpty()
  @IsEnum(PROJECT_CATEGORY_WITH_ALL_ENUM)
  project_category: string;

  @Field(() => Int, { nullable: false })
  @IsNotEmpty()
  @IsInt()
  @Min(0)
  offset: number;
}

import { Field, InputType, Int } from '@nestjs/graphql';
import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsString,
  Length,
  Min,
} from 'class-validator';
import { PROJECT_CATEGORY_WITH_ALL_ENUM } from 'src/common/interfaces/enum';

@InputType()
export class FetchProjectsByCountryDTO {
  @Field(() => Int, { nullable: false })
  @IsNotEmpty()
  @IsInt()
  @Min(0)
  offset: number;

  @Field(() => String, { nullable: false })
  @IsNotEmpty()
  @IsString()
  @Length(2, 2)
  country_code: string;

  @Field(() => PROJECT_CATEGORY_WITH_ALL_ENUM, {
    defaultValue: 'All',
    nullable: false,
  })
  @IsNotEmpty()
  @IsEnum(PROJECT_CATEGORY_WITH_ALL_ENUM)
  project_category: string;
}

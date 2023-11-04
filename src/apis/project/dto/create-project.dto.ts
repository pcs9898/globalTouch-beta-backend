import {
  Field,
  Float,
  InputType,
  PickType,
  registerEnumType,
} from '@nestjs/graphql';
import { Project } from '../entity/project.entity';
import { IsEnum, IsNotEmpty, IsNumber, IsString } from 'class-validator';
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

  @Field(() => String, {
    nullable: false,
  })
  @IsString()
  @IsNotEmpty()
  countryCode: string;

  @Field(() => String, {
    nullable: false,
  })
  @IsString()
  @IsNotEmpty()
  cityName: string;

  @Field(() => Float, { nullable: false })
  @IsNotEmpty()
  @IsNumber()
  lat: number;

  @Field(() => Float, { nullable: false })
  @IsNotEmpty()
  @IsNumber()
  lng: number;

  @Field(() => String, { nullable: false })
  @IsNotEmpty()
  @IsString()
  projectImageUrls: string;
}

import { Field, InputType, Int } from '@nestjs/graphql';
import { IsInt, IsNotEmpty, IsString, Length, Min } from 'class-validator';

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
}

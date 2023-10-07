import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsString, Length } from 'class-validator';

@InputType()
export class UpdateCountryCodeDTO {
  @Field(() => String, { nullable: false })
  @IsNotEmpty()
  @IsString()
  @Length(2, 2)
  country_code: string;
}

import { Field, InputType, Int } from '@nestjs/graphql';
import { IsInt, IsNotEmpty, Min } from 'class-validator';

@InputType()
export class FetchProjectsUserLoggedInDTO {
  @Field(() => Int, { nullable: false })
  @IsNotEmpty()
  @IsInt()
  @Min(1)
  offset: number;
}

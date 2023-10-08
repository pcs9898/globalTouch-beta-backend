import { Field, InputType, Int } from '@nestjs/graphql';
import { IsInt, IsNotEmpty, Min } from 'class-validator';

@InputType()
export class FetchProjectsNewestDTO {
  @Field(() => Int, { nullable: false })
  @IsNotEmpty()
  @IsInt()
  @Min(0)
  offset: number;
}

import { Field, InputType, Int } from '@nestjs/graphql';
import { IsInt, IsNotEmpty, IsString, Min } from 'class-validator';

@InputType()
export class FetchProjectCommentsDTO {
  @Field(() => String, { nullable: false })
  @IsNotEmpty()
  @IsString()
  project_id: string;

  @Field(() => Int)
  @IsNotEmpty()
  @IsInt()
  @Min(1)
  offset: number;
}

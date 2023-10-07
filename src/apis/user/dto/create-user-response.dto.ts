import { Field, ObjectType } from '@nestjs/graphql';
import { IsNotEmpty, IsString } from 'class-validator';

@ObjectType()
export class CreateUserResponseDTO {
  @Field(() => String, { nullable: false })
  @IsNotEmpty()
  @IsString()
  accessToken: string;
}

import { Field, ObjectType } from '@nestjs/graphql';
import { IsBoolean, IsNotEmpty } from 'class-validator';

@ObjectType()
export class CreateUpdatedProjectResponseDTO {
  @Field(() => Boolean, { nullable: false })
  @IsNotEmpty()
  @IsBoolean()
  success: boolean;
}

import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class CreateProjectResponseDTO {
  @Field(() => String)
  project_id: string;
}

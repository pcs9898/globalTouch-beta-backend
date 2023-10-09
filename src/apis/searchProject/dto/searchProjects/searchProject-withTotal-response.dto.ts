import { Field, Int, ObjectType } from '@nestjs/graphql';
import { SearchProjectResponseDTO } from './searchProject-response.dto';

@ObjectType()
export class SearchProjectWithTotalResponseDTO {
  @Field(() => [SearchProjectResponseDTO])
  searchProjects: SearchProjectResponseDTO[];

  @Field(() => Int)
  total: number;
}

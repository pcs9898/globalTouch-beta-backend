import { Field, Int, ObjectType } from '@nestjs/graphql';
import { SearchProjectsResponseDTO } from './searchProjects-response.dto';

@ObjectType()
export class SearchProjectsWithTotalResponseDTO {
  @Field(() => [SearchProjectsResponseDTO])
  searchProjects: SearchProjectsResponseDTO[];

  @Field(() => Int)
  total: number;
}

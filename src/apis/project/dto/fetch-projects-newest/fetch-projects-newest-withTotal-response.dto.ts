import { Field, Int, ObjectType } from '@nestjs/graphql';
import { FetchProjectsNewestResponseDTO } from './fetch-projects-newest-reponse.dto';

@ObjectType()
export class FetchProjectsNewestWithTotalResponseDTO {
  @Field(() => [FetchProjectsNewestResponseDTO])
  projectsNewest: FetchProjectsNewestResponseDTO[];

  @Field(() => Int)
  total: number;
}

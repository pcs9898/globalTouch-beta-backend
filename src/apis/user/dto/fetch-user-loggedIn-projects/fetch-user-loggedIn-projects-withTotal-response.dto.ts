import { Field, Int, ObjectType } from '@nestjs/graphql';
import { FetchUserLoggedInProjectsResponseDTO } from './fetch-user-loggedIn-projects-response.dto';

@ObjectType()
export class FetchUserLoggedInProjectsWithTotalResponseDTO {
  @Field(() => [FetchUserLoggedInProjectsResponseDTO])
  projectsUserLoggedIn: FetchUserLoggedInProjectsResponseDTO[];

  @Field(() => Int)
  total: number;
}

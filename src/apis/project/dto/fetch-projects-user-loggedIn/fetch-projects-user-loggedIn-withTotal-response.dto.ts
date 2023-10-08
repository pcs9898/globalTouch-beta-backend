import { Field, Int, ObjectType } from '@nestjs/graphql';
import { FetchProjectsUserLoggedInResponseDTO } from './fetch-projects-user-LoggedIn-response.dto';

@ObjectType()
export class FetchProjectsUserLoggedInWithTotalResponseDTO {
  @Field(() => [FetchProjectsUserLoggedInResponseDTO])
  projectsUserLoggedIn: FetchProjectsUserLoggedInResponseDTO[];

  @Field(() => Int)
  total: number;
}

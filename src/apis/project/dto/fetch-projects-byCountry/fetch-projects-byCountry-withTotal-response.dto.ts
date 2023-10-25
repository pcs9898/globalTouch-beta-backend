import { Field, Int, ObjectType } from '@nestjs/graphql';
import { FetchProjectsByCountryResponseDTO } from './fetch-projects-byCountry-response.dto';

@ObjectType()
export class FetchProjectsByCountryWithTotalResponseDTO {
  @Field(() => [FetchProjectsByCountryResponseDTO])
  projects: FetchProjectsByCountryResponseDTO[];

  @Field(() => Int)
  total: number;
}

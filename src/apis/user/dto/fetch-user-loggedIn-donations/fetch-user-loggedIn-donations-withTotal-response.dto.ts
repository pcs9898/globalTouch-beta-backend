import { Field, Int, ObjectType } from '@nestjs/graphql';
import { FetchUserLoggedInDonationsResponseDTO } from './fetch-user-loggedIn-donations-response.dto';

@ObjectType()
export class FetchUserLoggedInDonationsWithTotalResponseDTO {
  @Field(() => [FetchUserLoggedInDonationsResponseDTO])
  UserLoggedInDonations: FetchUserLoggedInDonationsResponseDTO[];

  @Field(() => Int)
  total: number;
}

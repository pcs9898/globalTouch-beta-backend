import { Field, Int, ObjectType } from '@nestjs/graphql';
import { FetchProjectsTrendingResponseDTO } from './fetch-projects-trending-response.dto';

@ObjectType()
export class FetchProjectsTrendingWithTotalResponseDTO {
  @Field(() => [FetchProjectsTrendingResponseDTO])
  projectsTrending: FetchProjectsTrendingResponseDTO[];

  @Field(() => Int)
  total: number;
}

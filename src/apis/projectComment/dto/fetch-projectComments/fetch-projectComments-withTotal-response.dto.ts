import { Field, Int, ObjectType } from '@nestjs/graphql';
import { FetchProjectCommentsResponseDTO } from './fetch-projectComments-response.dto';

@ObjectType()
export class FetchProjectCommentsWithTotalResponseDTO {
  @Field(() => [FetchProjectCommentsResponseDTO])
  projectComments: FetchProjectCommentsResponseDTO[];

  @Field(() => Int, { nullable: false })
  total: number;
}

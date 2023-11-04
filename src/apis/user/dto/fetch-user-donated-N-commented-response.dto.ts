import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class FetchUserDonatedNCommentedResponseDTO {
  @Field(() => Boolean, { nullable: false })
  donated: boolean;

  @Field(() => Boolean, { nullable: false })
  commented: boolean;

  @Field(() => String, { nullable: false })
  id: string;
}

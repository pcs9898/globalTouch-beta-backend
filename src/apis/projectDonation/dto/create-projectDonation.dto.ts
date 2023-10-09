import { Field, InputType, PickType } from '@nestjs/graphql';
import { ProjectDonation } from '../entity/projectDonation.entity';
import { IsNotEmpty, IsString } from 'class-validator';

@InputType()
export class CreateProjectDonationDTO extends PickType(
  ProjectDonation,
  ['imp_uid', 'amount'] as const,
  InputType,
) {
  @Field(() => String, { nullable: false })
  @IsNotEmpty()
  @IsString()
  project_id: string;
}

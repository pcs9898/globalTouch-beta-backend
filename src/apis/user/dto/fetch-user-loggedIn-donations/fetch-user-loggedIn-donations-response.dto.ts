import { ObjectType, PickType } from '@nestjs/graphql';
import { ProjectDonation } from 'src/apis/projectDonation/entity/projectDonation.entity';

@ObjectType()
export class FetchUserLoggedInDonationsResponseDTO extends PickType(
  ProjectDonation,
  ['project', 'amount', 'created_at'] as const,
  ObjectType,
) {}

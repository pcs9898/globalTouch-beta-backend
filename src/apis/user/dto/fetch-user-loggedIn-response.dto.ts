import { ObjectType, PickType } from '@nestjs/graphql';
import { User } from '../entity/user.entity';

@ObjectType()
export class FetchUserLoggedInResponseDTO extends PickType(User, [
  'name',
  'profile_image_url',
  'countryCode',
] as const) {}

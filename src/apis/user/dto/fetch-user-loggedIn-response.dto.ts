import { ObjectType, PickType } from '@nestjs/graphql';
import { User } from '../entity/user.entity';

@ObjectType()
export class FetchUserLoggedInResponseDTO extends PickType(User, [
  'email',
  'name',
  'profile_image_url',
  'country_code',
] as const) {}

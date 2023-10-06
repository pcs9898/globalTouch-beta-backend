import { ObjectType, PickType } from '@nestjs/graphql';
import { User } from '../entity/user.entity';

@ObjectType()
export class CreateUserResponseDTO extends PickType(User, [
  'user_id',
  'name',
  'profile_image_url',
  'country_code',
] as const) {}

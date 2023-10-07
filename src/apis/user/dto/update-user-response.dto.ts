import { ObjectType, PartialType, PickType } from '@nestjs/graphql';
import { User } from '../entity/user.entity';

@ObjectType()
export class UpdateUserResponseDTO extends PickType(PartialType(User), [
  'name',
  'profile_image_url',
]) {}

import { InputType, PartialType, PickType } from '@nestjs/graphql';
import { User } from '../entity/user.entity';

@InputType()
export class UpdateUserDTO extends PickType(
  PartialType(User),
  ['name', 'profile_image_url'] as const,
  InputType,
) {}

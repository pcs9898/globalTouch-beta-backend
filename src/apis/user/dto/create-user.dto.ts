import { Field, InputType, PickType } from '@nestjs/graphql';
import { User } from '../entity/user.entity';
import { IsNotEmpty, IsString, Length } from 'class-validator';

// @InputType()
// export class CreateUserDTO extends PickType(User, [
//   'email',
//   'name',
//   'profile_image_url',
//   'country_code',
// ] as const) {
//   @Field(() => String, { nullable: false })
//   @IsNotEmpty()
//   @IsString()
//   password: string;
// }

@InputType()
export class CreateUserDTO extends PickType(
  User,
  ['email', 'name', 'profile_image_url'] as const,
  InputType,
) {
  @Field(() => String, { nullable: false })
  @IsNotEmpty()
  @IsString()
  password: string;

  @Field(() => String, { nullable: false })
  @IsNotEmpty()
  @IsString()
  @Length(2, 2)
  country_code: string;
}

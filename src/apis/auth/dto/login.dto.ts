import { InputType, PickType } from '@nestjs/graphql';
import { CreateUserDTO } from 'src/apis/user/dto/create-user.dto';

@InputType()
export class LoginDTO extends PickType(CreateUserDTO, [
  'email',
  'password',
] as const) {}

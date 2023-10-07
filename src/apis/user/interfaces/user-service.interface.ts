import { IContext } from 'src/common/interfaces/context';
import { CreateUserDTO } from '../dto/create-user.dto';

export interface IUserServiceCreateUser {
  createUserDTO: CreateUserDTO;
  context: IContext;
}

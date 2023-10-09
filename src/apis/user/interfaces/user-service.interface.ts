import { IContext } from 'src/common/interfaces/context';
import { CreateUserDTO } from '../dto/create-user.dto';
import { UpdateCountryCodeDTO } from '../dto/update-countryCode.dto';
import { UpdateUserDTO } from '../dto/update-user.dto';

export interface IUserServiceCreateUser {
  createUserDTO: CreateUserDTO;
  context: IContext;
}

export interface IUserServiceUpdateCountryCode {
  updateCountryCodeDTO: UpdateCountryCodeDTO;
  context: IContext;
}

export interface IUserServiceFetchUserLoggedIn {
  context: IContext;
}

export interface IUserServiceUpdateUser {
  updateUserDTO: UpdateUserDTO;
  context: IContext;
}

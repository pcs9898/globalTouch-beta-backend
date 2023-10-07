import { CreateUserDTO } from '../dto/create-user.dto';

export interface IUserServiceCreateUser {
  createUserDTO: CreateUserDTO;
}

export interface IUserServiceFindOneByEmail {
  email: string;
}

export interface IUserServiceCreateUserWithGoogle {
  name: string;
  email: string;
}

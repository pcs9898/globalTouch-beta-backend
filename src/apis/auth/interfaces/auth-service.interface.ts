import { IAuthUser, IContext } from 'src/common/interfaces/context';
import { LoginDTO } from '../dto/login.dto';
import { User } from 'src/apis/user/entity/user.entity';
import { Response } from 'express';

export interface IOAuthUser {
  user: {
    name: string;
    email: string;
  };
}
export interface IAuthServiceLogin {
  loginDTO: LoginDTO;
  context: IContext;
}

export interface IAuthServiceSetRefreshToken {
  user: User;
  res: Response;
}

export interface IAuthServiceGetAccessToken {
  user: User | IAuthUser['user'];
}

export interface IAuthServiceRestoreAccessToken {
  user: IAuthUser['user'];
}

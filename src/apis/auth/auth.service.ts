import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { LoginDTO } from 'src/apis/auth/dto/login.dto';
import * as bcrypt from 'bcrypt';
import { IContext } from 'src/common/interfaces/context';
import { User } from '../user/entity/user.entity';
import { Response } from 'express';

export interface IAuthServiceLogin {
  loginDTO: LoginDTO;
  context: IContext;
}

export interface IAuthServiceSetRefreshToken {
  user: User;
  res: Response;
}

export interface IAuthServiceGetAccessToken {
  user: User;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async login({ loginDTO, context }: IAuthServiceLogin): Promise<string> {
    const user = await this.userService.findOneByEmail({
      email: loginDTO.email,
    });
    if (!user) throw new UnprocessableEntityException('User does not exist');

    const isAuth = await bcrypt.compare(loginDTO.password, user.password_hash);
    if (!isAuth) throw new UnprocessableEntityException('Wrong Password');

    this.setRefreshToken({ user, res: context.res });

    return this.getAccessToken({ user });
  }

  setRefreshToken({ user, res }: IAuthServiceSetRefreshToken): void {
    const refreshToken = this.jwtService.sign(
      { sub: user.user_id },
      { secret: process.env.PASSPORT_JWT_REFRESH_SECRET_KEY, expiresIn: '2w' },
    );

    res.setHeader('set-cookie', `refreshToken=${refreshToken}; path=/;`);
  }

  getAccessToken({ user }: IAuthServiceGetAccessToken): string {
    return this.jwtService.sign(
      { sub: user.user_id },
      { secret: process.env.PASSPORT_JWT_ACCESS_SECRET_KEY, expiresIn: '1d' },
    );
  }
}

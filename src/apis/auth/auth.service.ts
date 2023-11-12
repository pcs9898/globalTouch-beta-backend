import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import * as bcrypt from 'bcrypt';
import {
  IAuthServiceGetAccessToken,
  IAuthServiceLogin,
  IAuthServiceRestoreAccessToken,
  IAuthServiceSetRefreshToken,
} from './interfaces/auth-service.interface';
import { CommonService } from '../common/common.service';
import { IContext } from 'src/common/interfaces/context';

@Injectable()
export class AuthService {
  constructor(
    private readonly commonService: CommonService,
    private readonly jwtService: JwtService,
  ) {}

  async loginUser({ loginDTO, context }: IAuthServiceLogin): Promise<string> {
    const user = await this.commonService.findOneUserByEmail({
      email: loginDTO.email,
    });
    if (!user) throw new UnprocessableEntityException('User does not exist');

    const isAuth = await bcrypt.compare(loginDTO.password, user.password_hash);
    if (!isAuth) throw new UnprocessableEntityException('Wrong Password');

    this.setRefreshToken({ user, context });

    const accessToken = this.getAccessToken({ user });

    return accessToken;
  }

  setRefreshToken({ user, context, res }: IAuthServiceSetRefreshToken): void {
    const refreshToken = this.jwtService.sign(
      { sub: user.user_id },
      { secret: process.env.PASSPORT_JWT_REFRESH_SECRET_KEY, expiresIn: '2w' },
    );

    //local
    // if (res) {
    //   res.setHeader(
    //     'set-cookie',
    //     `refreshToken=${refreshToken}; path=/; sameSite:none; secure:true; httpOnly:true; `,
    //   );
    // } else {
    //   context.res.setHeader(
    //     'set-cookie',
    //     `refreshToken=${refreshToken}; path=/; sameSite:none; secure:true; httpOnly:true; `,
    //   );
    // }

    //docker
    if (res) {
      res.setHeader(
        'set-Cookie',
        `refreshToken=${refreshToken}; path=/; domain=.channitest.shop; SameSite=None;  Secure; `,
      );
    } else {
      context.res.setHeader(
        'set-Cookie',
        `refreshToken=${refreshToken}; path=/; domain=.channitest.shop;  SameSite=None; Secure; `,
      );
    }
  }

  logout(context: IContext) {
    context.res.setHeader(
      'set-Cookie',
      `refreshToken=; path=/; domain=.channitest.shop; SameSite=None; Secure; expires=Thu, 01 Jan 1970 00:00:00 UTC`,
    );
    // console.log('hi');
    // context.res.setHeader(
    //   'set-Cookie',
    //   `refreshToken=; path=/;  SameSite=None; Secure; expires=Thu, 01 Jan 1970 00:00:00 UTC`,
    // );

    return true;
  }

  getAccessToken({ user }: IAuthServiceGetAccessToken): string {
    return this.jwtService.sign(
      { sub: user.user_id },
      { secret: process.env.PASSPORT_JWT_ACCESS_SECRET_KEY, expiresIn: '1d' },
    );
  }

  restoreAccessToken({ user }: IAuthServiceRestoreAccessToken): string {
    const accessToken = this.getAccessToken({ user });

    return accessToken;
  }
}

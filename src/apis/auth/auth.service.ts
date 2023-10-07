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

@Injectable()
export class AuthService {
  constructor(
    private readonly commonService: CommonService,
    private readonly jwtService: JwtService,
  ) {}

  async login({ loginDTO, context }: IAuthServiceLogin): Promise<string> {
    const user = await this.commonService.findOneByEmail({
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

  restoreAccessToken({ user }: IAuthServiceRestoreAccessToken): string {
    return this.getAccessToken({ user });
  }
}

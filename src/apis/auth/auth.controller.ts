import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { Request, Response } from 'express';
import { IOAuthUser } from './interfaces/auth-service.interface';
import { CommonService } from '../common/common.service';
import { User } from '../user/entity/user.entity';

@Controller()
export class AuthController {
  constructor(
    private readonly commonService: CommonService,
    private readonly authService: AuthService,
  ) {}

  @UseGuards(AuthGuard('google'))
  @Get('/login/google')
  async googleLoginUser(
    @Req() req: Request & IOAuthUser,
    @Res() res: Response,
  ) {
    const user = await this.findOrCreateUser({ user: req.user });

    this.authService.setRefreshToken({ user, res });

    const redirectUrl = process.env.PASSPORT_OAUTH_GOOGLE_REDIRECT_URL_HOME;

    res.redirect(redirectUrl);
  }

  private async findOrCreateUser({ user: _user }: IOAuthUser): Promise<User> {
    let user = await this.commonService.findOneUserByEmail({
      email: _user.email,
    });

    if (!user) {
      user = await this.commonService.createUserWithGoogle({ ..._user });
    }

    return user;
  }
}

import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { Request, Response } from 'express';
import { IOAuthUser } from './interfaces/auth-service.interface';
import { CommonService } from '../common/common.service';

@Controller()
export class AuthController {
  constructor(
    private readonly commonService: CommonService,
    private readonly authService: AuthService,
  ) {}

  @UseGuards(AuthGuard('google'))
  @Get('/login/google')
  async googleLogin(@Req() req: Request & IOAuthUser, @Res() res: Response) {
    let user = await this.commonService.findOneByEmail({
      email: req.user.email,
    });

    if (!user) {
      user = await this.commonService.createUserWithGoogle({ ...req.user });
    }

    this.authService.setRefreshToken({ user, res });

    res.redirect(process.env.PASSPORT_OAUTH_GOOGLE_REDIRECT_URL);
  }
}

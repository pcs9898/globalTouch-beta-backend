import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-jwt';

export class JwtRefreshStrategy extends PassportStrategy(Strategy, 'refresh') {
  constructor() {
    super({
      jwtFromRequest: (req) => {
        const cookie = req.headers.cookie;

        if (cookie === undefined) {
          return;
        }
        const cookies = cookie.split('; ');
        let refreshToken = '';

        for (let i = 0; i < cookies.length; i++) {
          const cookieParts = cookies[i].split('=');

          if (cookieParts[0] === 'refreshToken') {
            refreshToken = cookieParts[1];

            break;
          }
        }

        return refreshToken;
      },
      secretOrKey: process.env.PASSPORT_JWT_REFRESH_SECRET_KEY,
    });
  }

  validate(payload) {
    return {
      user_id: payload.sub,
    };
  }
}

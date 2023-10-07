import { Module } from '@nestjs/common';
import { AuthResolver } from './auth.resolver';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { JwtGoogleStrategy } from './strateiges/jwt-social-google.strategy';
import { JwtAccessStrategy } from './strateiges/jwt-access.strategy';
import { JwtRefreshStrategy } from './strateiges/jwt-refresh.strategy';
import { CommonModule } from '../common/common.module';

@Module({
  imports: [JwtModule.register({}), CommonModule],
  providers: [
    JwtAccessStrategy,
    JwtRefreshStrategy,
    JwtGoogleStrategy,
    AuthResolver,
    AuthService,
  ],
  controllers: [AuthController],
  exports: [AuthService, JwtAccessStrategy, JwtRefreshStrategy],
})
export class AuthModule {}

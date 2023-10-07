import { Module } from '@nestjs/common';
import { AuthResolver } from './auth.resolver';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from '../user/user.module';
import { AuthController } from './auth.controller';
import { JwtGoogleStrategy } from './strateiges/jwt-social-google.strategy';

@Module({
  imports: [JwtModule.register({}), UserModule],
  providers: [JwtGoogleStrategy, AuthResolver, AuthService],
  controllers: [AuthController],
})
export class AuthModule {}

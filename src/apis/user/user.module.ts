import { Module } from '@nestjs/common';
import { UserResolver } from './user.resolver';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entity/user.entity';
import { CountryCode } from '../countryCode/entity/countryCode.entity';
import { AuthModule } from '../auth/auth.module';
import { CommonModule } from '../common/common.module';
import { CountryCodeModule } from '../countryCode/countryCode.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, CountryCode]),
    AuthModule,
    CommonModule,
    CountryCodeModule,
  ],
  providers: [UserResolver, UserService],
  exports: [UserService],
})
export class UserModule {}

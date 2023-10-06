import { Module } from '@nestjs/common';
import { UserResolver } from './user.resolver';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entity/user.entity';
import { CountryCode } from '../countryCode/entity/countryCode.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, CountryCode])],
  providers: [UserResolver, UserService],
  exports: [UserService],
})
export class UserModule {}

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CountryCode } from './entity/countryCode.entity';
import { CountryCodeService } from './countryCode.service';

@Module({
  imports: [TypeOrmModule.forFeature([CountryCode])],
  providers: [CountryCodeService],
  exports: [CountryCodeService],
})
export class CountryCodeModule {}

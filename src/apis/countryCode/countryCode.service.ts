import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CountryCode } from './entity/countryCode.entity';
import { Repository } from 'typeorm';
import { IUserServiceFindOneCountryCode } from './interfaces/countryCode-service.interface';

@Injectable()
export class CountryCodeService {
  constructor(
    @InjectRepository(CountryCode)
    private readonly countryCodeRepository: Repository<CountryCode>,
  ) {}

  async findOneCountryCode({ country_code }: IUserServiceFindOneCountryCode) {
    return this.countryCodeRepository.findOne({
      where: { country_code },
    });
  }
}

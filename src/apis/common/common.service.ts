import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../user/entity/user.entity';
import { Repository } from 'typeorm';
import { ICommonServiceFindOneByEmail } from './interfaces/common-service.interface';

export interface ICommonServiceCreateUserWithGoogle {
  name: string;
  email: string;
}

@Injectable()
export class CommonService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  findOneByEmail({ email }: ICommonServiceFindOneByEmail) {
    return this.userRepository.findOne({ where: { email } });
  }

  async createUserWithGoogle({
    name,
    email,
  }: ICommonServiceCreateUserWithGoogle): Promise<User> {
    return this.userRepository.save({ name, email });
  }
}

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../user/entity/user.entity';
import { Repository } from 'typeorm';
import {
  ICommonServiceCreateUserWithGoogle,
  ICommonServiceFindUserOneByEmail,
} from './interfaces/common-service.interface';

@Injectable()
export class CommonService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  findOneUserByEmail({ email }: ICommonServiceFindUserOneByEmail) {
    return this.userRepository.findOne({ where: { email } });
  }

  createUserWithGoogle({
    name,
    email,
  }: ICommonServiceCreateUserWithGoogle): Promise<User> {
    return this.userRepository.save({ name, email });
  }
}

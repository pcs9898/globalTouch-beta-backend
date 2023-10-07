import {
  ConflictException,
  Injectable,
  UnprocessableEntityException,
} from '@nestjs/common';
import { CreateUserResponseDTO } from './dto/create-user-response.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entity/user.entity';
import { Repository } from 'typeorm';
import { CountryCode } from '../countryCode/entity/countryCode.entity';
import { plainToClass } from 'class-transformer';
import * as bcrypt from 'bcrypt';
import {
  IUserServiceCreateUser,
  IUserServiceCreateUserWithGoogle,
  IUserServiceFindOneByEmail,
} from './interfaces/user-service.interface';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @InjectRepository(CountryCode)
    private readonly countryCodeRepository: Repository<CountryCode>,
  ) {}

  findOneByEmail({ email }: IUserServiceFindOneByEmail) {
    return this.userRepository.findOne({ where: { email } });
  }

  async create({
    createUserDTO,
  }: IUserServiceCreateUser): Promise<CreateUserResponseDTO> {
    const user = await this.findOneByEmail({ email: createUserDTO.email });

    if (user) throw new ConflictException('Already registered email');

    const hashedPassword = await bcrypt.hash(createUserDTO.password, 10);

    const countryCode = await this.countryCodeRepository.findOne({
      where: { country_code: createUserDTO.country_code },
    });

    if (!countryCode)
      throw new UnprocessableEntityException('Invalid country code');

    const newUser = await this.userRepository.save({
      ...createUserDTO,
      password_hash: hashedPassword,
      country_code: countryCode,
    });

    return plainToClass(CreateUserResponseDTO, newUser);
  }

  async createUserWithGoogle({
    name,
    email,
  }: IUserServiceCreateUserWithGoogle): Promise<User> {
    return this.userRepository.save({ name, email });
  }
}

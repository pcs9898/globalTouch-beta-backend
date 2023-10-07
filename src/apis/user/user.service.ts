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
import * as bcrypt from 'bcrypt';
import { IUserServiceCreateUser } from './interfaces/user-service.interface';
import { CommonService } from '../common/common.service';
import { AuthService } from '../auth/auth.service';
import { IContext } from 'src/common/interfaces/context';
import { UpdateCountryCodeDTO } from './dto/update-countryCode.dto';
import { UpdateCountryCodeReponseDTO } from './dto/update-countryCode-response.dto';
import { FetchUserLoggedInResponseDTO } from './dto/fetch-user-loggedIn-response.dto';
import { plainToClass } from 'class-transformer';
import { UpdateUserDTO } from './dto/update-user.dto';
import { UpdateUserResponseDTO } from './dto/update-user-response.dto';

export interface IUserServiceUpdateCountryCode {
  updateCountryCodeDTO: UpdateCountryCodeDTO;
  context: IContext;
}

export interface IUserServiceFindOneCountryCode {
  country_code: string;
}

export interface IUserServiceFindOneUserById {
  user_id: string;
}

export interface IUserServiceFetchUserLoggedIn {
  context: IContext;
}

export interface IUserServiceUpdateUser {
  updateUserDTO: UpdateUserDTO;
  context: IContext;
}

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @InjectRepository(CountryCode)
    private readonly countryCodeRepository: Repository<CountryCode>,

    private readonly commonService: CommonService,

    private readonly authService: AuthService,
  ) {}

  async createUser({
    createUserDTO,
    context,
  }: IUserServiceCreateUser): Promise<CreateUserResponseDTO> {
    const user = await this.commonService.findOneUserByEmail({
      email: createUserDTO.email,
    });

    if (user) throw new ConflictException('Already registered email');

    const hashedPassword = await bcrypt.hash(createUserDTO.password, 10);

    const country_code = await this.findOneCountryCode({
      country_code: createUserDTO.country_code,
    });

    if (!country_code)
      throw new UnprocessableEntityException('Invalid country code');

    const newUser = await this.userRepository.save({
      ...createUserDTO,
      password_hash: hashedPassword,
      country_code,
    });

    this.authService.setRefreshToken({ user: newUser, res: context.res });

    const accessToken = this.authService.getAccessToken({ user: newUser });

    return { accessToken };
  }

  async updateCountryCode({
    updateCountryCodeDTO,
    context,
  }: IUserServiceUpdateCountryCode): Promise<UpdateCountryCodeReponseDTO> {
    const user = await this.findOneUserById({
      user_id: context.req.user.user_id,
    });
    if (!user) throw new UnprocessableEntityException("User doesn't exist");

    const country_code = await this.findOneCountryCode({
      country_code: updateCountryCodeDTO.country_code,
    });
    if (!country_code)
      throw new UnprocessableEntityException('Invalid Country Code');

    const updatedUser = await this.userRepository.save({
      ...user,
      country_code,
    });

    const accessToken = this.authService.getAccessToken({ user: updatedUser });

    return { accessToken };
  }

  //
  async fetchUserLoggedIn({
    context,
  }: IUserServiceFetchUserLoggedIn): Promise<FetchUserLoggedInResponseDTO> {
    const user = await this.userRepository.findOne({
      where: { user_id: context.req.user.user_id },
      relations: ['country_code'],
    });
    if (!user) throw new UnprocessableEntityException("User doesn't exist");

    return plainToClass(FetchUserLoggedInResponseDTO, user);
  }

  //
  async updateUser({
    updateUserDTO,
    context,
  }: IUserServiceUpdateUser): Promise<UpdateUserResponseDTO> {
    const user = await this.findOneUserById({
      user_id: context.req.user.user_id,
    });
    if (!user) throw new UnprocessableEntityException("User doesn't exist");

    const updatedUser = await this.userRepository.save({
      ...user,
      ...updateUserDTO,
    });

    return plainToClass(UpdateUserResponseDTO, updatedUser);
  }

  //
  async findOneUserById({ user_id }: IUserServiceFindOneUserById) {
    return this.userRepository.findOne({
      where: { user_id },
      relations: ['country_code'],
    });
  }

  //
  async findOneCountryCode({ country_code }: IUserServiceFindOneCountryCode) {
    return this.countryCodeRepository.findOne({ where: { country_code } });
  }
}

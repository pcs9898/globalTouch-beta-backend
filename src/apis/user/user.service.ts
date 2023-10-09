import {
  ConflictException,
  Injectable,
  UnprocessableEntityException,
} from '@nestjs/common';
import { CreateUserResponseDTO } from './dto/create-user-response.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entity/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import {
  IUserServiceCreateUser,
  IUserServiceFetchUserLoggedIn,
  IUserServiceUpdateCountryCode,
  IUserServiceUpdateUser,
} from './interfaces/user-service.interface';
import { CommonService } from '../common/common.service';
import { AuthService } from '../auth/auth.service';
import { UpdateCountryCodeResponseDTO } from './dto/update-countryCode-response.dto';
import { FetchUserLoggedInResponseDTO } from './dto/fetch-user-loggedIn-response.dto';
import { plainToClass } from 'class-transformer';
import { UpdateUserResponseDTO } from './dto/update-user-response.dto';
import { CountryCodeService } from '../countryCode/countryCode.service';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    private readonly commonService: CommonService,

    private readonly authService: AuthService,

    private readonly countryCodeService: CountryCodeService,
  ) {}

  // createUser
  async createUser({
    createUserDTO,
    context,
  }: IUserServiceCreateUser): Promise<CreateUserResponseDTO> {
    const user = await this.commonService.findOneUserByEmail({
      email: createUserDTO.email,
    });
    if (user) throw new ConflictException('Already registered email');

    const hashedPassword = await bcrypt.hash(createUserDTO.password, 10);

    console.log(createUserDTO.country_code);
    const country_code = await this.countryCodeService.findOneCountryCode({
      country_code: createUserDTO.country_code,
    });
    if (!country_code)
      throw new UnprocessableEntityException('Invalid country code');

    const newUser = await this.userRepository.save({
      ...createUserDTO,
      password_hash: hashedPassword,
      countryCode: country_code,
    });

    this.authService.setRefreshToken({ user: newUser, res: context.res });

    const accessToken = this.authService.getAccessToken({ user: newUser });

    return { accessToken };
  }

  // updateCountryCode
  async updateCountryCode({
    updateCountryCodeDTO,
    context,
  }: IUserServiceUpdateCountryCode): Promise<UpdateCountryCodeResponseDTO> {
    const foundCountryCode = await this.countryCodeService.findOneCountryCode({
      country_code: updateCountryCodeDTO.country_code,
    });
    if (!foundCountryCode)
      throw new UnprocessableEntityException('Invalid Country Code');

    await this.userRepository.update(context.req.user.user_id, {
      countryCode: foundCountryCode,
    });

    const accessToken = this.authService.getAccessToken({
      user: context.req.user,
    });

    return { accessToken };
  }

  // fetchUserLoggedIn
  async fetchUserLoggedIn({
    context,
  }: IUserServiceFetchUserLoggedIn): Promise<FetchUserLoggedInResponseDTO> {
    const user = await this.userRepository.findOne({
      where: { user_id: context.req.user.user_id },
      relations: ['countryCode'],
    });

    return plainToClass(FetchUserLoggedInResponseDTO, user);
  }

  // updateUser
  async updateUser({
    updateUserDTO,
    context,
  }: IUserServiceUpdateUser): Promise<UpdateUserResponseDTO> {
    await this.userRepository.update(context.req.user.user_id, updateUserDTO);

    const updatedUser = await this.commonService.findOneUserById({
      user_id: context.req.user.user_id,
    });

    return plainToClass(UpdateUserResponseDTO, updatedUser);
  }

  //
}

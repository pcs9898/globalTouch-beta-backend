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

export interface IUserServiceUpdateCountryCode {
  updateCountryCodeDTO: UpdateCountryCodeDTO;
  context: IContext;
}

export interface IUserServiceFindOneCountryCode {
  country_code: string;
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

  async create({
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
    const user = await this.userRepository.findOne({
      where: { user_id: context.req.user.user_id },
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

  async findOneCountryCode({ country_code }: IUserServiceFindOneCountryCode) {
    return this.countryCodeRepository.findOne({ where: { country_code } });
  }
}

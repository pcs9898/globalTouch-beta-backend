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
    const user = await this.commonService.findOneByEmail({
      email: createUserDTO.email,
    });

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

    this.authService.setRefreshToken({ user: newUser, res: context.res });

    const accessToken = this.authService.getAccessToken({ user: newUser });

    return { accessToken };
  }
}

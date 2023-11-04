import { ConflictException, Injectable } from '@nestjs/common';
import { CreateUserResponseDTO } from './dto/create-user-response.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entity/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import {
  IUserServiceCreateUser,
  IUserServiceFetchUserDonatedNCommented,
  IUserServiceFetchUserLoggedIn,
  IUserServiceUpdateUser,
} from './interfaces/user-service.interface';
import { CommonService } from '../common/common.service';
import { AuthService } from '../auth/auth.service';

import { FetchUserLoggedInResponseDTO } from './dto/fetch-user-loggedIn-response.dto';
import { plainToClass } from 'class-transformer';
import { UpdateUserResponseDTO } from './dto/update-user-response.dto';
import { FetchUserDonatedNCommentedResponseDTO } from './dto/fetch-user-donated-N-commented-response.dto';
import { ProjectCommentService } from '../projectComment/projectComment.service';
import { ProjectDonationService } from '../projectDonation/projectDonation.service';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    private readonly commonService: CommonService,

    private readonly authService: AuthService,

    private readonly projectCommentService: ProjectCommentService,

    private readonly projectDonationService: ProjectDonationService,
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

    const newUser = await this.userRepository.save({
      ...createUserDTO,
      password_hash: hashedPassword,
    });

    this.authService.setRefreshToken({ user: newUser, context });

    const accessToken = this.authService.getAccessToken({ user: newUser });

    return { accessToken };
  }

  // fetchUserLoggedIn
  async fetchUserLoggedIn({
    context,
  }: IUserServiceFetchUserLoggedIn): Promise<FetchUserLoggedInResponseDTO> {
    const user = await this.userRepository.findOne({
      where: { user_id: context.req.user.user_id },
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

  async fetchUserDonatedNCommented({
    project_id,
    context,
  }: IUserServiceFetchUserDonatedNCommented): Promise<FetchUserDonatedNCommentedResponseDTO> {
    const foundDonation = await this.projectDonationService.checkUserDonated({
      user_id: context.req.user.user_id,
      project_id,
    });

    const foundComment = await this.projectCommentService.checkUserCommented({
      user_id: context.req.user.user_id,
      project_id,
    });
    console.log(!!foundComment);

    return {
      id: project_id,
      donated: !!foundDonation,
      commented: !!foundComment,
    };
  }
}

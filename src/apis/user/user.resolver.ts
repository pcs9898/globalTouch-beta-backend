import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UserService } from './user.service';
import { CreateUserResponseDTO } from './dto/create-user-response.dto';
import { CreateUserDTO } from './dto/create-user.dto';
import { IContext } from 'src/common/interfaces/context';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '../auth/guards/gql-auth.guard';
import { UpdateCountryCodeReponseDTO } from './dto/update-countryCode-response.dto';
import { UpdateCountryCodeDTO } from './dto/update-countryCode.dto';
import { FetchUserLoggedInResponseDTO } from './dto/fetch-user-loggedIn-response.dto';
import { UpdateUserResponseDTO } from './dto/update-user-response.dto';
import { UpdateUserDTO } from './dto/update-user.dto';

@Resolver()
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Query(() => String)
  sayHello(): string {
    return 'hi';
  }

  @Mutation(() => CreateUserResponseDTO)
  async createUser(
    @Args('createUserDTO') createUserDTO: CreateUserDTO,
    @Context() context: IContext,
  ): Promise<CreateUserResponseDTO> {
    return this.userService.createUser({ createUserDTO, context });
  }

  @UseGuards(GqlAuthGuard('access'))
  @Mutation(() => UpdateCountryCodeReponseDTO)
  async updateCountryCode(
    @Args('updateCountryCodeDTO') updateCountryCodeDTO: UpdateCountryCodeDTO,
    @Context() context: IContext,
  ): Promise<UpdateCountryCodeReponseDTO> {
    return this.userService.updateCountryCode({
      updateCountryCodeDTO,
      context,
    });
  }

  @UseGuards(GqlAuthGuard('access'))
  @Query(() => FetchUserLoggedInResponseDTO)
  async fetchUserLoggedIn(
    @Context() context: IContext,
  ): Promise<FetchUserLoggedInResponseDTO> {
    return this.userService.fetchUserLoggedIn({ context });
  }

  @UseGuards(GqlAuthGuard('access'))
  @Mutation(() => UpdateUserResponseDTO)
  async updateUser(
    @Args('updateUserDTO') updateUserDTO: UpdateUserDTO,
    @Context() context: IContext,
  ): Promise<UpdateUserResponseDTO> {
    return this.userService.updateUser({ updateUserDTO, context });
  }
}

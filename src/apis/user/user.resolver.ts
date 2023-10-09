import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UserService } from './user.service';
import { CreateUserResponseDTO } from './dto/create-user-response.dto';
import { CreateUserDTO } from './dto/create-user.dto';
import { IContext } from 'src/common/interfaces/context';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '../auth/guards/gql-auth.guard';
import { UpdateCountryCodeResponseDTO } from './dto/update-countryCode-response.dto';
import { UpdateCountryCodeDTO } from './dto/update-countryCode.dto';
import { FetchUserLoggedInResponseDTO } from './dto/fetch-user-loggedIn-response.dto';
import { UpdateUserResponseDTO } from './dto/update-user-response.dto';
import { UpdateUserDTO } from './dto/update-user.dto';
import { FetchUserLoggedInProjectsDTO } from './dto/fetch-user-loggedIn-projects/fetch-user-loggedIn-projects.dto';
import { FetchUserLoggedInProjectsWithTotalResponseDTO } from './dto/fetch-user-loggedIn-projects/fetch-user-loggedIn-projects-withTotal-response.dto';
import { ProjectService } from '../project/project.service';
import { ProjectDonationService } from '../projectDonation/projectDonation.service';
import { FetchUserLoggedInDonationsWithTotalResponseDTO } from './dto/fetch-user-loggedIn-donations/fetch-user-loggedIn-donations-withTotal-response.dto';
import { FetchUserLoggedInDonationsDTO } from './dto/fetch-user-loggedIn-donations/fetch-user-loggedIn-donations.dto';

@Resolver()
export class UserResolver {
  constructor(
    private readonly userService: UserService,

    private readonly projectDonationService: ProjectDonationService,

    private readonly projectService: ProjectService,
  ) {}

  @UseGuards(GqlAuthGuard('access'))
  @Query(() => FetchUserLoggedInResponseDTO)
  async fetchUserLoggedIn(
    @Context() context: IContext,
  ): Promise<FetchUserLoggedInResponseDTO> {
    return this.userService.fetchUserLoggedIn({ context });
  }

  @UseGuards(GqlAuthGuard('access'))
  @Query(() => FetchUserLoggedInProjectsWithTotalResponseDTO)
  async fetchUserLoggedInProjects(
    @Args('fetchUserLoggedInProjectsDTO')
    fetchUserLoggedInProjectsDTO: FetchUserLoggedInProjectsDTO,
    @Context() context: IContext,
  ): Promise<FetchUserLoggedInProjectsWithTotalResponseDTO> {
    return this.projectService.fetchProjectsUserLoggedIn({
      fetchUserLoggedInProjectsDTO,
      context,
    });
  }

  @UseGuards(GqlAuthGuard('access'))
  @Query(() => FetchUserLoggedInDonationsWithTotalResponseDTO)
  async fetchUserLoggedInDonations(
    @Args('fetchUserLoggedInDonationsDTO')
    fetchUserLoggedInDonationsDTO: FetchUserLoggedInDonationsDTO,
    @Context() context: IContext,
  ): Promise<FetchUserLoggedInDonationsWithTotalResponseDTO> {
    return this.projectDonationService.fetchProjectDonationsUserLoggedIn({
      fetchUserLoggedInDonationsDTO,
      context,
    });
  }

  @Mutation(() => CreateUserResponseDTO)
  async createUser(
    @Args('createUserDTO') createUserDTO: CreateUserDTO,
    @Context() context: IContext,
  ): Promise<CreateUserResponseDTO> {
    return this.userService.createUser({ createUserDTO, context });
  }

  @UseGuards(GqlAuthGuard('access'))
  @Mutation(() => UpdateCountryCodeResponseDTO)
  async updateCountryCode(
    @Args('updateCountryCodeDTO') updateCountryCodeDTO: UpdateCountryCodeDTO,
    @Context() context: IContext,
  ): Promise<UpdateCountryCodeResponseDTO> {
    return this.userService.updateCountryCode({
      updateCountryCodeDTO,
      context,
    });
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

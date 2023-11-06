import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UserService } from './user.service';
import { CreateUserResponseDTO } from './dto/create-user-response.dto';
import { CreateUserDTO } from './dto/create-user.dto';
import { IContext } from 'src/common/interfaces/context';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '../auth/guards/gql-auth.guard';
import { FetchUserLoggedInResponseDTO } from './dto/fetch-user-loggedIn-response.dto';
import { UpdateUserResponseDTO } from './dto/update-user-response.dto';
import { UpdateUserDTO } from './dto/update-user.dto';
import { ProjectService } from '../project/project.service';
import { ProjectDonationService } from '../projectDonation/projectDonation.service';
import { FetchUserDonatedNCommentedResponseDTO } from './dto/fetch-user-donated-N-commented-response.dto';
import { Project } from '../project/entity/project.entity';
import { ProjectDonation } from '../projectDonation/entity/projectDonation.entity';

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
  @Query(() => [Project])
  async fetchUserLoggedInProjects(
    @Args('offset')
    offset: number,
    @Context() context: IContext,
  ): Promise<Project[]> {
    return this.projectService.fetchProjectsUserLoggedIn({
      offset,
      context,
    });
  }

  @UseGuards(GqlAuthGuard('access'))
  @Query(() => [ProjectDonation])
  async fetchUserLoggedInDonations(
    @Args('offset')
    offset: number,
    @Context() context: IContext,
  ): Promise<ProjectDonation[]> {
    return this.projectDonationService.fetchProjectDonationsUserLoggedIn({
      offset,
      context,
    });
  }

  @UseGuards(GqlAuthGuard('access'))
  @Query(() => FetchUserDonatedNCommentedResponseDTO)
  async fetchUserDonatedNCommented(
    @Args('project_id')
    project_id: string,
    @Context() context: IContext,
  ): Promise<FetchUserDonatedNCommentedResponseDTO> {
    return this.userService.fetchUserDonatedNCommented({
      project_id,
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
  @Mutation(() => UpdateUserResponseDTO)
  async updateUser(
    @Args('updateUserDTO') updateUserDTO: UpdateUserDTO,
    @Context() context: IContext,
  ): Promise<UpdateUserResponseDTO> {
    return this.userService.updateUser({ updateUserDTO, context });
  }
}

import { Args, Context, Mutation, Resolver } from '@nestjs/graphql';
import { ProjectDonationService } from './projectDonation.service';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '../auth/guards/gql-auth.guard';
import { CreateProjectDonationResponseDTO } from './dto/create-projectDonation-response.dto';
import { CreateProjectDonationDTO } from './dto/create-projectDonation.dto';
import { IContext } from 'src/common/interfaces/context';

@Resolver()
export class ProjectDonationResolver {
  constructor(
    private readonly projectDonationService: ProjectDonationService,
  ) {}

  @UseGuards(GqlAuthGuard('access'))
  @Mutation(() => CreateProjectDonationResponseDTO)
  async createProjectDonation(
    @Args('createProjectDonationDTO')
    createProjectDonationDTO: CreateProjectDonationDTO,
    @Context() context: IContext,
  ): Promise<CreateProjectDonationResponseDTO> {
    return this.projectDonationService.createProjectDonation({
      createProjectDonationDTO,
      context,
    });
  }
}

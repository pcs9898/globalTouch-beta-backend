import { Args, Context, Mutation, Resolver } from '@nestjs/graphql';
import { ProjectCommentService } from './projectComment.service';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '../auth/guards/gql-auth.guard';
import { CreateProjectCommentResponseDTO } from './dto/create-projectComment-response.dto';
import { CreateProjectCommentDTO } from './dto/create-projectComment.dto';
import { IContext } from 'src/common/interfaces/context';

@Resolver()
export class ProjectCommentResolver {
  constructor(private readonly projectCommentService: ProjectCommentService) {}

  @UseGuards(GqlAuthGuard('access'))
  @Mutation(() => CreateProjectCommentResponseDTO)
  async createProjectComment(
    @Args('createProjectCommentDTO')
    createProjectCommentDTO: CreateProjectCommentDTO,
    @Context() context: IContext,
  ): Promise<CreateProjectCommentResponseDTO> {
    return this.projectCommentService.createProjectComment({
      createProjectCommentDTO,
      context,
    });
  }
}

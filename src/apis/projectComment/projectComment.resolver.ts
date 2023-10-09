import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { ProjectCommentService } from './projectComment.service';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '../auth/guards/gql-auth.guard';
import { CreateProjectCommentResponseDTO } from './dto/create-projectComment-response.dto';
import { CreateProjectCommentDTO } from './dto/create-projectComment.dto';
import { IContext } from 'src/common/interfaces/context';
import { FetchProjectCommentsWithTotalResponseDTO } from './dto/fetch-projectComments/fetch-projectComments-withTotal-response.dto';
import { FetchProjectCommentsDTO } from './dto/fetch-projectComments/fetch-projectComments.dto';
import { UpdateProjectCommentResponseDTO } from './dto/update-projectComment-response.dto';
import { UpdateProjectCommentDTO } from './dto/update-projectcomment.dto';

@Resolver()
export class ProjectCommentResolver {
  constructor(private readonly projectCommentService: ProjectCommentService) {}

  @Query(() => FetchProjectCommentsWithTotalResponseDTO)
  async fetchProjectComments(
    @Args('fetchProjectCommentsDTO')
    fetchProjectCommentsDTO: FetchProjectCommentsDTO,
  ): Promise<FetchProjectCommentsWithTotalResponseDTO> {
    return this.projectCommentService.fetchProjectComments({
      fetchProjectCommentsDTO,
    });
  }

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

  @UseGuards(GqlAuthGuard('access'))
  @Mutation(() => UpdateProjectCommentResponseDTO)
  async updateProjectComment(
    @Args('updateProjectCommentDTO')
    updateProjectCommentDTO: UpdateProjectCommentDTO,
    @Context() context: IContext,
  ): Promise<UpdateProjectCommentResponseDTO> {
    return this.projectCommentService.updateProjectComment({
      updateProjectCommentDTO,
      context,
    });
  }
}

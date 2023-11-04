import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { ProjectCommentService } from './projectComment.service';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '../auth/guards/gql-auth.guard';
import { CreateProjectCommentDTO } from './dto/create-projectComment.dto';
import { IContext } from 'src/common/interfaces/context';
import { UpdateProjectCommentDTO } from './dto/update-projectcomment.dto';
import { DeleteProjectCommentResponseDTO } from './dto/delete-projectComment-response.dto';
import { DeleteProjectCommentDTO } from './dto/delete-projectcomment.dto';
import { ProjectComment } from './entity/projectComment.entity';

@Resolver()
export class ProjectCommentResolver {
  constructor(private readonly projectCommentService: ProjectCommentService) {}

  @Query(() => [ProjectComment])
  async fetchProjectComments(
    @Args('project_id') project_id: string,
    @Args('offset') offset: number,
  ): Promise<ProjectComment[]> {
    return this.projectCommentService.fetchProjectComments({
      project_id,
      offset,
    });
  }

  @UseGuards(GqlAuthGuard('access'))
  @Mutation(() => ProjectComment)
  async createProjectComment(
    @Args('createProjectCommentDTO')
    createProjectCommentDTO: CreateProjectCommentDTO,
    @Context() context: IContext,
  ): Promise<ProjectComment> {
    return this.projectCommentService.createProjectComment({
      createProjectCommentDTO,
      context,
    });
  }

  @UseGuards(GqlAuthGuard('access'))
  @Mutation(() => ProjectComment)
  async updateProjectComment(
    @Args('updateProjectCommentDTO')
    updateProjectCommentDTO: UpdateProjectCommentDTO,
    @Context() context: IContext,
  ): Promise<ProjectComment> {
    return this.projectCommentService.updateProjectComment({
      updateProjectCommentDTO,
      context,
    });
  }

  @UseGuards(GqlAuthGuard('access'))
  @Mutation(() => DeleteProjectCommentResponseDTO)
  async deleteProjectComment(
    @Args('deleteProjectCommentDTO')
    deleteProjectCommentDTO: DeleteProjectCommentDTO,
    @Context() context: IContext,
  ): Promise<DeleteProjectCommentResponseDTO> {
    return this.projectCommentService.deleteProjectComment({
      deleteProjectCommentDTO,
      context,
    });
  }
}

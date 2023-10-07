import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { LoginDTO } from './dto/login.dto';
import { IContext } from 'src/common/interfaces/context';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from './guards/gql-auth.guard';

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(() => String)
  async loginUser(
    @Args('loginDTO') loginDTO: LoginDTO,
    @Context() context: IContext,
  ): Promise<string> {
    return this.authService.loginUser({ loginDTO, context });
  }

  @UseGuards(GqlAuthGuard('refresh'))
  @Mutation(() => String)
  restoreAccessToken(@Context() context: IContext): string {
    return this.authService.restoreAccessToken({ user: context.req.user });
  }
}

import { Args, Context, Mutation, Resolver } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { LoginDTO } from './dto/login.dto';
import { IContext } from 'src/common/interfaces/context';

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(() => String)
  async login(
    @Args('loginDTO') loginDTO: LoginDTO,
    @Context() context: IContext,
  ): Promise<string> {
    return this.authService.login({ loginDTO, context });
  }
}

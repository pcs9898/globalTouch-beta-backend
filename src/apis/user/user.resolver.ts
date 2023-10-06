import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UserService } from './user.service';
import { CreateUserResponseDTO } from './dto/create-user-response.dto';
import { CreateUserDTO } from './dto/create-user.dto';

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
  ): Promise<CreateUserResponseDTO> {
    return this.userService.create({ createUserDTO });
  }
}

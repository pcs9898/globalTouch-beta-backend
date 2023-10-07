import { ObjectType } from '@nestjs/graphql';
import { CreateUserResponseDTO } from './create-user-response.dto';

@ObjectType()
export class UpdateCountryCodeReponseDTO extends CreateUserResponseDTO {}

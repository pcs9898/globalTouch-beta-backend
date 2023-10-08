import { ObjectType, PickType } from '@nestjs/graphql';
import { Project } from '../../entity/project.entity';

@ObjectType()
export class FetchProjectsUserLoggedInResponseDTO extends PickType(
  Project,
  [
    'projectImages',
    'title',
    'countryCode',
    'amount_required',
    'amount_raised',
  ] as const,
  ObjectType,
) {}

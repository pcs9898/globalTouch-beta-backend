import { ObjectType, PickType } from '@nestjs/graphql';
import { Project } from '../entity/project.entity';

@ObjectType()
export class FetchProjectsNewestResponseDTO extends PickType(
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

import { ObjectType, PickType } from '@nestjs/graphql';
import { Project } from 'src/apis/project/entity/project.entity';

@ObjectType()
export class SearchProjectResponseDTO extends PickType(
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

import { Project } from '../entity/project.entity';
import { ObjectType, PickType } from '@nestjs/graphql';

@ObjectType()
export class CreateProjectResponseDTO extends PickType(
  Project,
  [
    'amount_raised',
    'amount_required',
    'content',
    'countryCode',
    'created_at',
    'donation_count',
    'projectCategory',
    'projectImages',
    'project_id',
    'title',
    'user',
  ] as const,
  ObjectType,
) {}

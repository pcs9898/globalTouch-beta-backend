import { ObjectType, PickType } from '@nestjs/graphql';
import { Project } from '../entity/project.entity';

@ObjectType()
export class FetchProjectResponseDTO extends PickType(Project, [
  'project_id',
  'title',
  'content',
  'amount_required',
  'amount_raised',
  'donation_count',
  'created_at',
  'user',
  'countryCode',
  'projectCategory',
  'projectImages',
] as const) {}

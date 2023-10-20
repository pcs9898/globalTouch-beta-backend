import { Field, ObjectType, PickType } from '@nestjs/graphql';
import { Project } from 'src/apis/project/entity/project.entity';

@ObjectType()
export class SearchProjectResponseDTO extends PickType(
  Project,
  [
    'project_id',
    'title',
    'countryCode',
    'amount_required',
    'amount_raised',
  ] as const,
  ObjectType,
) {
  @Field(() => String)
  project_image_url: string;
}

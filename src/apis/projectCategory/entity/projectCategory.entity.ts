import { Field, ObjectType } from '@nestjs/graphql';
import { Entity, PrimaryColumn } from 'typeorm';

@Entity()
@ObjectType()
export class ProjectCategory {
  @PrimaryColumn({ type: 'varchar', nullable: false })
  @Field(() => String)
  project_category: string;
}

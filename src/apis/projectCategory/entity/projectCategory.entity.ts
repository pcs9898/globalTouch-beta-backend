import { Field, ObjectType } from '@nestjs/graphql';
import { IsNotEmpty, IsString, Length } from 'class-validator';
import { Entity, PrimaryColumn } from 'typeorm';

@Entity()
@ObjectType()
export class ProjectCategory {
  @PrimaryColumn({ type: 'varchar', length: 30, nullable: false })
  @Field(() => String)
  @IsNotEmpty()
  @IsString()
  @Length(1, 30)
  project_category: string;
}

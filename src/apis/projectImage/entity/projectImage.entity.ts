import { Field, ObjectType } from '@nestjs/graphql';
import { IsNotEmpty, IsString } from 'class-validator';
import { Project } from 'src/apis/project/entity/project.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
@ObjectType()
export class ProjectImage {
  @PrimaryGeneratedColumn()
  @Field(() => String)
  projectImage_id: string;

  @Column({ type: 'text', nullable: false })
  @IsNotEmpty()
  @IsString()
  @Field(() => String, { nullable: false })
  image_url: string;

  @JoinColumn({ name: 'project_id' })
  @ManyToOne(() => Project, { nullable: false })
  @Field(() => Project)
  project: Project;
}

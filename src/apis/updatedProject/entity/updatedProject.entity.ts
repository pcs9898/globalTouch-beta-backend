import { Field, ObjectType } from '@nestjs/graphql';
import { IsNotEmpty, IsString } from 'class-validator';
import { Project } from 'src/apis/project/entity/project.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
@ObjectType()
export class UpdatedProject {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String)
  updatedProject_id: string;

  @Column({ type: 'text', nullable: false })
  @IsNotEmpty()
  @IsString()
  @Field(() => String, { nullable: false })
  content: string;

  @CreateDateColumn()
  @Field(() => Date)
  created_at: Date;

  @JoinColumn({ name: 'project_id' })
  @ManyToOne(() => Project, (project) => project.updatedProjects, {
    nullable: false,
  })
  @Field(() => Project)
  project: Project;
}

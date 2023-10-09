import { Field, ObjectType } from '@nestjs/graphql';
import { IsNotEmpty, IsString, Length } from 'class-validator';
import { Project } from 'src/apis/project/entity/project.entity';
import { User } from 'src/apis/user/entity/user.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
@ObjectType()
export class ProjectComment {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String)
  projectComment_id: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  @IsNotEmpty()
  @IsString()
  @Length(1, 255)
  @Field(() => String, { nullable: false })
  content: string;

  @CreateDateColumn()
  @Field(() => Date)
  created_at: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  @JoinColumn({ name: 'user_id' })
  @ManyToOne(() => User, { nullable: false })
  @Field(() => User)
  user: User;

  @JoinColumn({ name: 'project_id' })
  @ManyToOne(() => Project, {
    nullable: false,
  })
  @Field(() => Project)
  project: Project;
}

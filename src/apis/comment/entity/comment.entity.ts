import { Field, ObjectType } from '@nestjs/graphql';
import { IsNotEmpty, IsString, Length } from 'class-validator';
import { Project } from 'src/apis/project/entity/project.entity';
import { User } from 'src/apis/user/entity/user.entity';
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
export class Comment {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String)
  comment_id: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  @IsNotEmpty()
  @IsString()
  @Length(1, 255)
  @Field(() => String, { nullable: false })
  comment_content: string;

  @CreateDateColumn()
  @Field(() => Date)
  created_at: Date;

  @JoinColumn({ name: 'user_id' })
  @ManyToOne(() => User, { nullable: false })
  @Field(() => User)
  user: User;

  @JoinColumn({ name: 'project_id' })
  @ManyToOne(() => Project, { nullable: false })
  @Field(() => Project)
  project: Project;
}

import { Field, Int, ObjectType } from '@nestjs/graphql';
import { IsInt, IsNotEmpty, IsString, Length, Min } from 'class-validator';
import { ProjectCategory } from 'src/apis/projectCategory/entity/projectCategory.entity';
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
export class Project {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String)
  project_id: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  @IsNotEmpty()
  @IsString()
  @Length(1, 255)
  @Field(() => String, { nullable: false })
  title: string;

  @Column({ type: 'text', nullable: false })
  @IsNotEmpty()
  @IsString()
  @Field(() => String, { nullable: false })
  content: string;

  @Column({ type: 'int', nullable: false })
  @IsNotEmpty()
  @IsInt()
  @Min(0)
  @Field(() => Int, { nullable: false })
  amount_required: number;

  @Column({ type: 'int', nullable: false, default: 0 })
  @IsNotEmpty()
  @IsInt()
  @Min(0)
  @Field(() => Int, { nullable: false })
  amount_raised: number;

  @Column({ type: 'int', nullable: false, default: 0 })
  @IsNotEmpty()
  @IsInt()
  @Min(0)
  @Field(() => Int, { nullable: false })
  donation_count: number;

  @CreateDateColumn()
  @Field(() => Date)
  created_at: Date;

  @JoinColumn({ name: 'user_id' })
  @ManyToOne(() => User, { nullable: false })
  @Field(() => User)
  user_id: User;

  @JoinColumn({ name: 'project_category' })
  @ManyToOne(() => ProjectCategory, { nullable: false })
  @Field(() => ProjectCategory)
  projectCategory: ProjectCategory;
}

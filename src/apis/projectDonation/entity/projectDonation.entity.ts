import { Field, Int, ObjectType, registerEnumType } from '@nestjs/graphql';
import { IsInt, IsNotEmpty, IsString, Length, Min } from 'class-validator';
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

export enum PROJECT_DONATION_STATUS_ENUM {
  PAYMENT = 'PAYMENT',
  CANCEL = 'CANCEL',
}

registerEnumType(PROJECT_DONATION_STATUS_ENUM, {
  name: 'PROJECT_DONATION_STATUS_ENUM',
});

@Entity()
@ObjectType()
export class ProjectDonation {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String)
  projectDonation_id: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  @IsNotEmpty()
  @IsString()
  @Length(1, 255)
  @Field(() => String, { nullable: false })
  imp_uid: string;

  @Column({ type: 'int', nullable: false })
  @IsNotEmpty()
  @IsInt()
  @Min(0)
  @Field(() => Int, { nullable: false })
  amount: number;

  @Column({ type: 'enum', enum: PROJECT_DONATION_STATUS_ENUM, nullable: false })
  @Field(() => PROJECT_DONATION_STATUS_ENUM, { nullable: false })
  status: string;

  @CreateDateColumn()
  @Field(() => Date)
  created_at: Date;

  @JoinColumn({ name: 'user_id' })
  @ManyToOne(() => User, (user) => user.projectDonations, { nullable: false })
  @Field(() => User)
  user: User;

  @JoinColumn({ name: 'project_id' })
  @ManyToOne(() => Project, {
    nullable: false,
  })
  @Field(() => Project)
  project: Project;
}

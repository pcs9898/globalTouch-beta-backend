import { Field, Int, ObjectType } from '@nestjs/graphql';
import { IsInt, IsNotEmpty, IsString, Length, Min } from 'class-validator';
import { CountryCode } from 'src/apis/countryCode/entity/countryCode.entity';
import { ProjectCategory } from 'src/apis/projectCategory/entity/projectCategory.entity';
import { ProjectImage } from 'src/apis/projectImage/entity/projectImage.entity';
import { User } from 'src/apis/user/entity/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
@ObjectType()
export class Project {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String)
  project_id: string;

  @Column({ unique: true, type: 'varchar', length: 255, nullable: false })
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
  @ManyToOne(() => User, (user) => user.projects, { nullable: false })
  @Field(() => User)
  user: User;

  @JoinColumn({ name: 'project_category' })
  @ManyToOne(() => ProjectCategory, { nullable: false })
  @Field(() => ProjectCategory)
  projectCategory: ProjectCategory;

  @JoinColumn({ name: 'country_code' })
  @ManyToOne(() => CountryCode, { nullable: false })
  @Field(() => CountryCode)
  countryCode: CountryCode;

  @OneToMany(() => ProjectImage, (projectImage) => projectImage.project)
  @Field(() => [ProjectImage])
  projectImages: ProjectImage[];
}

import { Field, ObjectType } from '@nestjs/graphql';
import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';
import { CountryCode } from 'src/apis/countryCode/entity/countryCode.entity';
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
export class User {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String)
  user_id: string;

  @Column({ unique: true, type: 'varchar', length: 255, nullable: false })
  @Field(() => String, { nullable: false })
  @IsNotEmpty()
  @IsEmail()
  @Length(1, 255)
  email: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  password_hash: string;

  @Column({ type: 'varchar', length: 30, nullable: false })
  @Field(() => String, { nullable: false })
  @IsNotEmpty()
  @IsString()
  @Length(1, 30)
  name: string;

  @Column({ type: 'text', nullable: true })
  @Field(() => String, { nullable: true })
  @IsString()
  profile_image_url: string;

  @CreateDateColumn()
  @Field(() => Date)
  created_at: Date;

  @JoinColumn({ name: 'country_code' })
  @ManyToOne(() => CountryCode, { nullable: true })
  @Field(() => CountryCode)
  countryCode: CountryCode;
}

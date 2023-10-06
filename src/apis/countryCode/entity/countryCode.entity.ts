import { Field, ObjectType } from '@nestjs/graphql';
import { IsString } from 'class-validator';
import { Entity, PrimaryColumn } from 'typeorm';

@Entity()
@ObjectType()
export class CountryCode {
  @PrimaryColumn({ type: 'char', length: 2, nullable: false })
  @IsString()
  @Field(() => String)
  country_code: string;
}

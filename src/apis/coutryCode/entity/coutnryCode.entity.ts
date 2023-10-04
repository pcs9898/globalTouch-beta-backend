import { Field, ObjectType } from '@nestjs/graphql';
import { Entity, PrimaryColumn } from 'typeorm';

@Entity()
@ObjectType()
export class CoutnryCode {
  @PrimaryColumn({ type: 'char', length: 2, nullable: false })
  @Field(() => String)
  country_code: string;
}

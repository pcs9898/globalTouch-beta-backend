import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './apis/user/user.module';
import { AuthModule } from './apis/auth/auth.module';
import { CommentModule } from './apis/comment/comment.module';
import { DonationModule } from './apis/donation/donation.module';
import { ProjectModule } from './apis/project/project.module';
import { ProjectImageModule } from './apis/projectImage/projectImage.module';
import { SearchModule } from './apis/search/search.module';
import { UpdatedProjectModule } from './apis/updatedProject/updatedProject.module';

@Module({
  imports: [
    AuthModule,
    CommentModule,
    DonationModule,
    ProjectModule,
    ProjectImageModule,
    SearchModule,
    UpdatedProjectModule,
    UserModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV}`,
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: 'src/common/graphql/schema.gql',
      // context: ({ req, res }) => ({ req, res }),
    }),
    TypeOrmModule.forRoot({
      type: String(process.env.DATABASE_TYPE) as 'mysql',
      host: process.env.DATABASE_HOST,
      port: Number(process.env.DATABASE_PORT),
      username: process.env.DATABASE_USERNAME,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_NAME,
      entities: [__dirname + '/apis/**/entity/*.entity.*'],
      synchronize: true,
      logging: true,
    }),
  ],
})
export class AppModule {}

import { Module } from '@nestjs/common';
import { ProjectImageService } from './projectImage.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProjectImage } from './entity/projectImage.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ProjectImage])],
  providers: [ProjectImageService],
  exports: [ProjectImageService],
})
export class ProjectImageModule {}

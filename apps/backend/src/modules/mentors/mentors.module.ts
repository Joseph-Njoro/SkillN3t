// apps/backend/src/modules/mentors/mentors.module.ts

import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MentorsService } from './mentors.service';
import { MentorsController } from './mentors.controller';
import { MentorProfile, MentorProfileSchema } from './schemas/mentor-profile.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: MentorProfile.name, schema: MentorProfileSchema }])],
  providers: [MentorsService],
  controllers: [MentorsController],
  exports: [MentorsService]
})
export class MentorsModule {}

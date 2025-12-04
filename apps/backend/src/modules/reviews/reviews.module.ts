// apps/backend/src/modules/reviews/reviews.module.ts

import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Review, ReviewSchema } from './schemas/review.schema';
import { ReviewsService } from './reviews.service';
import { ReviewsController } from './reviews.controller';
import { BookingsModule } from '../bookings/bookings.module';
import { MentorsModule } from '../mentors/mentors.module';

@Module({
  imports: [MongooseModule.forFeature([{ name: Review.name, schema: ReviewSchema }]), BookingsModule, MentorsModule],
  providers: [ReviewsService],
  controllers: [ReviewsController]
})
export class ReviewsModule {}

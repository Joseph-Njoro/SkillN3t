// apps/backend/src/modules/reviews/reviews.service.ts

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Review, ReviewDocument } from './schemas/review.schema';
import { BookingsService } from '../bookings/bookings.service';
import { MentorsService } from '../mentors/mentors.service';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectModel(Review.name) private reviewModel: Model<ReviewDocument>,
    private bookingsService: BookingsService,
    private mentorsService: MentorsService
  ) {}

  async submitReview(bookingId: string, reviewerId: string, rating: number, comment?: string) {
    // check booking
    const booking = await this.bookingsService.getById(bookingId);
    if (!booking) throw new NotFoundException('Booking not found');
    // only allow reviewer to be learner
    if (String(booking.learnerId) !== String(reviewerId)) throw new Error('Only learner can review');

    const review = new this.reviewModel({
      bookingId: new Types.ObjectId(bookingId),
      reviewerId: new Types.ObjectId(reviewerId),
      rating,
      comment
    });
    await review.save();
    // update mentor rating
    await this.mentorsService.updateRating(String(booking.mentorId), rating);
    return review.toObject();
  }
}

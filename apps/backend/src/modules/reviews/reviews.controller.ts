// apps/backend/src/modules/reviews/reviews.controller.ts

import { Controller, Post, Body, UseGuards, Req } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { AppAuthGuard } from '../../common/guards/auth.guard';
import { reviewSchema } from '../../../packages/shared/src/schemas';
import { ValidationPipe } from '../../common/pipes/zod-validation.pipe';

@Controller('api/reviews')
export class ReviewsController {
  constructor(private reviewsService: ReviewsService) {}

  @Post()
  @UseGuards(AppAuthGuard)
  async create(@Body() body: any, @Req() req: any) {
    const parsed = ValidationPipe.validateWithSchema(reviewSchema, body);
    return this.reviewsService.submitReview(parsed.bookingId, req.user.id, parsed.rating, parsed.comment);
  }
}

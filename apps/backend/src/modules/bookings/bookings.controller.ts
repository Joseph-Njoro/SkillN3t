// apps/backend/src/modules/bookings/bookings.controller.ts

import { Controller, Post, Param, UseGuards, Req, Body, Patch, Get } from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { AppAuthGuard } from '../../common/guards/auth.guard';
import { bookingRequestSchema } from '../../../packages/shared/src/schemas';
import { ValidationPipe } from '../../common/pipes/zod-validation.pipe';

@Controller('api')
export class BookingsController {
  constructor(private bookingsService: BookingsService) {}

  @Post('mentors/:id/book')
  @UseGuards(AppAuthGuard)
  async requestBooking(@Param('id') mentorId: string, @Body() body: any, @Req() req: any) {
    // body: { slotId, notes }
    const parsed = ValidationPipe.validateWithSchema(bookingRequestSchema, body);
    // use req.user.id as learnerId
    return this.bookingsService.requestBooking(parsed.slotId, req.user.id, parsed.notes);
  }

  @Patch('bookings/:id/accept')
  @UseGuards(AppAuthGuard)
  async accept(@Param('id') id: string, @Req() req: any) {
    return this.bookingsService.acceptBooking(id, req.user.id);
  }

  @Patch('bookings/:id/complete')
  @UseGuards(AppAuthGuard)
  async complete(@Param('id') id: string, @Req() req: any) {
    return this.bookingsService.completeBooking(id, req.user.id);
  }

  @Get('bookings')
  @UseGuards(AppAuthGuard)
  async myBookings(@Req() req: any) {
    return this.bookingsService.listByUser(req.user.id);
  }
}

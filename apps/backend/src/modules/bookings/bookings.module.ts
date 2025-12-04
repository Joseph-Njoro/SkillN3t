// apps/backend/src/modules/bookings/bookings.module.ts

import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Booking, BookingSchema } from './schemas/booking.schema';
import { BookingsService } from './bookings.service';
import { BookingsController } from './bookings.controller';
import { SlotsModule } from '../slots/slots.module';

@Module({
  imports: [MongooseModule.forFeature([{ name: Booking.name, schema: BookingSchema }]), SlotsModule],
  providers: [BookingsService],
  controllers: [BookingsController]
})
export class BookingsModule {}

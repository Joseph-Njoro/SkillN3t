// apps/backend/src/modules/bookings/bookings.service.ts

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Booking, BookingDocument } from './schemas/booking.schema';
import { SlotsService } from '../slots/slots.service';

@Injectable()
export class BookingsService {
  constructor(
    @InjectModel(Booking.name) private bookingModel: Model<BookingDocument>,
    private slotsService: SlotsService
  ) {}

  async requestBooking(slotId: string, learnerId: string, notes?: string) {
    // check slot
    const slot = await this.slotsService.findById(slotId);
    if (!slot) throw new NotFoundException('Slot not found');
    if (slot.isBooked) throw new Error('Slot already booked');

    // mark booked
    await this.slotsService.markBooked(slotId, true);

    const booking = new this.bookingModel({
      slotId: new Types.ObjectId(slotId),
      learnerId: new Types.ObjectId(learnerId),
      mentorId: slot.mentorId,
      status: 'requested',
      notes
    });
    await booking.save();
    return booking.toObject();
  }

  async getById(id: string) {
    const b = await this.bookingModel.findById(id).lean();
    if (!b) throw new NotFoundException('Booking not found');
    return b;
  }

  async acceptBooking(id: string, mentorId: string) {
    const b = await this.bookingModel.findById(id);
    if (!b) throw new NotFoundException('Booking not found');
    if (String(b.mentorId) !== String(mentorId)) throw new Error('Only mentor can accept');
    b.status = 'accepted';
    await b.save();
    return b.toObject();
  }

  async completeBooking(id: string, mentorId: string) {
    const b = await this.bookingModel.findById(id);
    if (!b) throw new NotFoundException('Booking not found');
    if (String(b.mentorId) !== String(mentorId)) throw new Error('Only mentor can complete');
    b.status = 'completed';
    await b.save();
    return b.toObject();
  }

  async listByUser(userId: string) {
    return this.bookingModel.find({ $or: [{ learnerId: userId }, { mentorId: userId }] }).lean();
  }
}

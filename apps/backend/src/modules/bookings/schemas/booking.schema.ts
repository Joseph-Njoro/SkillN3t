// apps/backend/src/modules/bookings/schemas/booking.schema.ts

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type BookingDocument = Booking & Document;

@Schema({ timestamps: true })
export class Booking {
  @Prop({ type: Types.ObjectId, ref: 'Slot', required: true })
  slotId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  learnerId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'MentorProfile', required: true })
  mentorId: Types.ObjectId;

  @Prop({ default: 'requested' })
  status: 'requested' | 'accepted' | 'completed' | 'cancelled';

  @Prop()
  notes?: string;
}

export const BookingSchema = SchemaFactory.createForClass(Booking);

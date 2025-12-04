// apps/backend/src/modules/slots/schemas/slot.schema.ts

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type SlotDocument = Slot & Document;

@Schema({ timestamps: true })
export class Slot {
  @Prop({ type: Types.ObjectId, ref: 'MentorProfile', required: true })
  mentorId: Types.ObjectId;

  @Prop({ required: true })
  startTime: Date;

  @Prop({ default: 30 })
  durationMins: number;

  @Prop({ default: false })
  isBooked: boolean;
}

export const SlotSchema = SchemaFactory.createForClass(Slot);

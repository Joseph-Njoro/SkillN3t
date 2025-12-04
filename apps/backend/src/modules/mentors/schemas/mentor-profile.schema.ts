// apps/backend/src/modules/mentors/schemas/mentor-profile.schema.ts

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type MentorProfileDocument = MentorProfile & Document;

@Schema({ timestamps: true })
export class MentorProfile {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Prop()
  bio?: string;

  @Prop({ type: [String], default: [] })
  skills: string[];

  @Prop({ default: 0 })
  ratingAvg: number;

  @Prop({ default: 0 })
  ratingCount: number;
}

export const MentorProfileSchema = SchemaFactory.createForClass(MentorProfile);

// apps/backend/src/modules/slots/slots.service.ts

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Slot, SlotDocument } from './schemas/slot.schema';

@Injectable()
export class SlotsService {
  constructor(@InjectModel(Slot.name) private slotModel: Model<SlotDocument>) {}

  async create(mentorId: string, startTime: Date, durationMins = 30) {
    const slot = new this.slotModel({ mentorId: new Types.ObjectId(mentorId), startTime, durationMins });
    await slot.save();
    return slot.toObject();
  }

  async listByMentor(mentorId: string) {
    return this.slotModel.find({ mentorId }).lean();
  }

  async findById(id: string) {
    const s = await this.slotModel.findById(id).lean();
    if (!s) throw new NotFoundException('Slot not found');
    return s;
  }

  async markBooked(id: string, value = true) {
    const s = await this.slotModel.findById(id);
    if (!s) throw new NotFoundException('Slot not found');
    s.isBooked = value;
    await s.save();
    return s.toObject();
  }
}

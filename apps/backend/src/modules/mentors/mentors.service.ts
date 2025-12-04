// apps/backend/src/modules/mentors/mentors.service.ts

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { MentorProfile, MentorProfileDocument } from './schemas/mentor-profile.schema';

@Injectable()
export class MentorsService {
  constructor(@InjectModel(MentorProfile.name) private mentorModel: Model<MentorProfileDocument>) {}

  async list(filters: { skill?: string } = {}) {
    const query: any = {};
    if (filters.skill) query.skills = filters.skill;
    return this.mentorModel.find(query).limit(100).lean();
  }

  async getById(id: string) {
    const doc = await this.mentorModel.findById(id).lean();
    if (!doc) throw new NotFoundException('Mentor not found');
    return doc;
  }

  async createOrUpdate(profile: Partial<MentorProfile>) {
    if (!profile.userId) throw new Error('userId required');
    const existing = await this.mentorModel.findOne({ userId: profile.userId });
    if (existing) {
      await this.mentorModel.updateOne({ _id: existing._id }, { $set: profile });
      return this.mentorModel.findById(existing._id).lean();
    }
    const created = new this.mentorModel(profile);
    await created.save();
    return created.toObject();
  }

  async updateRating(mentorId: string, rating: number) {
    const m = await this.mentorModel.findById(mentorId);
    if (!m) throw new NotFoundException('Mentor not found');
    const total = (m.ratingAvg * m.ratingCount) + rating;
    m.ratingCount = m.ratingCount + 1;
    m.ratingAvg = total / m.ratingCount;
    await m.save();
    return m.toObject();
  }
}

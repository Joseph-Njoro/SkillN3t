// apps/backend/src/modules/users/users.service.ts

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async findById(id: string) {
    const user = await this.userModel.findById(id).lean();
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async findByEmail(email: string) {
    return this.userModel.findOne({ email }).lean();
  }

  async createOrUpdateFromAuth(userData: Partial<User>) {
    const existing = await this.userModel.findOne({ email: userData.email });
    if (existing) {
      await this.userModel.updateOne({ _id: existing._id }, { $set: userData });
      return this.userModel.findById(existing._id).lean();
    }
    const created = new this.userModel(userData);
    await created.save();
    return created.toObject();
  }

  async listAll(limit = 50) {
    return this.userModel.find().limit(limit).lean();
  }
}

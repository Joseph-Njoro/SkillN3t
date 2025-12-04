// apps/backend/src/scripts/seed.ts

import * as mongoose from 'mongoose';
import * as dotenv from 'dotenv';
dotenv.config();
import { UserSchema } from '../modules/users/schemas/user.schema';
import { MentorProfileSchema } from '../modules/mentors/schemas/mentor-profile.schema';
import { SlotSchema } from '../modules/slots/schemas/slot.schema';
import { BookingSchema } from '../modules/bookings/schemas/booking.schema';

async function run() {
  const uri = process.env.MONGO_URI || 'mongodb://localhost:27017/skillnet_dev';
  await mongoose.connect(uri);

  const User = mongoose.model('User', UserSchema);
  const Mentor = mongoose.model('MentorProfile', MentorProfileSchema);
  const Slot = mongoose.model('Slot', SlotSchema);
  const Booking = mongoose.model('Booking', BookingSchema);

  // Cleanup
  await Promise.all([User.deleteMany({}), Mentor.deleteMany({}), Slot.deleteMany({}), Booking.deleteMany({})]);

  // Create users
  const mentorUser = await User.create({ email: 'mentor1@example.com', name: 'Mentor One', role: 'mentor' });
  const mentorUser2 = await User.create({ email: 'mentor2@example.com', name: 'Mentor Two', role: 'mentor' });
  const learnerUser = await User.create({ email: 'learner1@example.com', name: 'Learner One', role: 'learner' });

  // Mentors
  const m1 = await Mentor.create({ userId: mentorUser._id, bio: 'I teach backend', skills: ['node', 'nestjs'] });
  const m2 = await Mentor.create({ userId: mentorUser2._id, bio: 'Frontend wizard', skills: ['react', 'design'] });

  // Slots (two per mentor)
  const now = Date.now();
  const slot1 = await Slot.create({ mentorId: m1._id, startTime: new Date(now + 1000 * 60 * 60), durationMins: 30 });
  const slot2 = await Slot.create({ mentorId: m1._id, startTime: new Date(now + 1000 * 60 * 60 * 24), durationMins: 30 });
  const slot3 = await Slot.create({ mentorId: m2._id, startTime: new Date(now + 1000 * 60 * 90), durationMins: 30 });
  const slot4 = await Slot.create({ mentorId: m2._id, startTime: new Date(now + 1000 * 60 * 60 * 48), durationMins: 30 });

  // Booking sample
  const booking = await Booking.create({ slotId: slot1._id, learnerId: learnerUser._id, mentorId: m1._id, status: 'requested', notes: 'Excited to learn' });

  console.log('Seed complete');
  process.exit(0);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});

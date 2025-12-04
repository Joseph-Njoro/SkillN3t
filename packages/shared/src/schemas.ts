// packages/shared/src/schemas.ts

import { z } from 'zod';

// User
export const userSchema = z.object({
  email: z.string().email(),
  name: z.string().optional(),
  avatar: z.string().url().optional(),
  role: z.enum(['learner', 'mentor', 'admin']).optional()
});

// MentorProfile
export const mentorProfileSchema = z.object({
  userId: z.string().optional(), // server injects
  bio: z.string().max(1000).optional(),
  skills: z.array(z.string()).optional(),
  ratingAvg: z.number().optional(),
  ratingCount: z.number().optional()
});

// Slot
export const slotSchema = z.object({
  startTime: z.string().refine((s) => !Number.isNaN(Date.parse(s))),
  durationMins: z.number().int().positive().optional()
});

// Booking request
export const bookingRequestSchema = z.object({
  slotId: z.string(),
  notes: z.string().optional()
});

// Review
export const reviewSchema = z.object({
  bookingId: z.string(),
  rating: z.number().min(1).max(5),
  comment: z.string().optional()
});

// Exports
export type UserDTO = z.infer<typeof userSchema>;
export type MentorProfileDTO = z.infer<typeof mentorProfileSchema>;
export type SlotDTO = z.infer<typeof slotSchema>;
export type BookingRequestDTO = z.infer<typeof bookingRequestSchema>;
export type ReviewDTO = z.infer<typeof reviewSchema>;

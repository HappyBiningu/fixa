import { pgTable, uuid, varchar, decimal, integer, real, jsonb, timestamp } from "drizzle-orm/pg-core";
import { users } from "./users";

export const workerProfiles = pgTable('worker_profiles', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id).notNull().unique(),
  
  // Professional Info
  skills: jsonb('skills'), // Array of category IDs
  experienceLevel: varchar('experience_level', { length: 20 }),
  hourlyRateMin: decimal('hourly_rate_min', { precision: 10, scale: 2 }),
  hourlyRateMax: decimal('hourly_rate_max', { precision: 10, scale: 2 }),
  portfolio: jsonb('portfolio'), // Array of image URLs
  
  // Stats
  jobsCompleted: integer('jobs_completed').default(0),
  averageRating: real('average_rating').default(0),
  responseTime: integer('response_time'), // minutes
  acceptanceRate: real('acceptance_rate').default(0),
  completionRate: real('completion_rate').default(0),
  
  // Earnings
  totalEarnings: decimal('total_earnings', { precision: 10, scale: 2 }).default('0'),
  
  // Badges
  badges: jsonb('badges'), // Array of badge codes
  
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow()
});


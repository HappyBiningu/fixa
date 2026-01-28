import { pgTable, uuid, text, decimal, varchar, integer, real, timestamp } from "drizzle-orm/pg-core";
import { jobs } from "./jobs";
import { users } from "./users";

export const bids = pgTable('bids', {
  id: uuid('id').primaryKey().defaultRandom(),
  jobId: uuid('job_id').references(() => jobs.id).notNull(),
  workerId: uuid('worker_id').references(() => users.id).notNull(),
  
  // Proposal
  message: text('message').notNull(),
  proposedAmount: decimal('proposed_amount', { precision: 10, scale: 2 }).notNull(),
  estimatedDuration: varchar('estimated_duration', { length: 100 }),
  availability: varchar('availability', { length: 200 }),
  
  // Credits
  creditsSpent: integer('credits_spent').notNull(),
  
  // Status
  status: varchar('status', { length: 20 }).default('pending'),
  
  // Worker Snapshot
  workerRatingAtTime: real('worker_rating_at_time'),
  workerJobsCompletedAtTime: integer('worker_jobs_completed_at_time'),
  
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow()
});


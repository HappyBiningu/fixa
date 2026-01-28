import { pgTable, uuid, varchar, text, jsonb, timestamp } from "drizzle-orm/pg-core";
import { jobs } from "./jobs";
import { users } from "./users";

export const disputes = pgTable('disputes', {
  id: uuid('id').primaryKey().defaultRandom(),
  jobId: uuid('job_id').references(() => jobs.id).notNull(),
  raisedBy: uuid('raised_by').references(() => users.id).notNull(),
  againstUserId: uuid('against_user_id').references(() => users.id).notNull(),
  
  type: varchar('type', { length: 50 }).notNull(),
  description: text('description').notNull(),
  evidence: jsonb('evidence'), // Photos, screenshots, etc.
  
  status: varchar('status', { length: 20 }).default('open'), // open, investigating, resolved, closed
  priority: varchar('priority', { length: 20 }).default('medium'),
  
  assignedToAdmin: uuid('assigned_to_admin').references(() => users.id),
  resolution: text('resolution'),
  resolutionType: varchar('resolution_type', { length: 50 }),
  
  createdAt: timestamp('created_at').defaultNow(),
  resolvedAt: timestamp('resolved_at')
});


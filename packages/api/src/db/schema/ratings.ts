import { pgTable, uuid, real, text, boolean, timestamp } from "drizzle-orm/pg-core";
import { jobs } from "./jobs";
import { users } from "./users";

export const ratings = pgTable('ratings', {
  id: uuid('id').primaryKey().defaultRandom(),
  jobId: uuid('job_id').references(() => jobs.id).notNull(),
  fromUserId: uuid('from_user_id').references(() => users.id).notNull(),
  toUserId: uuid('to_user_id').references(() => users.id).notNull(),
  
  // Ratings (1-5, 0.5 increments)
  overallRating: real('overall_rating').notNull(),
  
  // Category ratings
  qualityRating: real('quality_rating'),
  professionalismRating: real('professionalism_rating'),
  communicationRating: real('communication_rating'),
  punctualityRating: real('punctuality_rating'),
  valueRating: real('value_rating'),
  
  // Review
  review: text('review'),
  
  // Metadata
  canEdit: boolean('can_edit').default(true),
  editedAt: timestamp('edited_at'),
  
  createdAt: timestamp('created_at').defaultNow()
});


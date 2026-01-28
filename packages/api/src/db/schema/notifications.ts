import { pgTable, uuid, varchar, text, timestamp, boolean } from "drizzle-orm/pg-core";
import { users } from "./users";
import { jobs } from "./jobs";
import { bids } from "./bids";

export const notifications = pgTable('notifications', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id).notNull(),
  
  type: varchar('type', { length: 50 }).notNull(),
  title: varchar('title', { length: 200 }).notNull(),
  message: text('message').notNull(),
  
  // Context
  jobId: uuid('job_id').references(() => jobs.id),
  bidId: uuid('bid_id').references(() => bids.id),
  
  // Metadata
  actionUrl: varchar('action_url', { length: 500 }),
  imageUrl: varchar('image_url', { length: 500 }),
  
  isRead: boolean('is_read').default(false),
  readAt: timestamp('read_at'),
  
  createdAt: timestamp('created_at').defaultNow()
});


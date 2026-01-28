import { pgTable, uuid, text, varchar, jsonb, boolean, timestamp } from "drizzle-orm/pg-core";
import { jobs } from "./jobs";
import { users } from "./users";

export const messages = pgTable('messages', {
  id: uuid('id').primaryKey().defaultRandom(),
  jobId: uuid('job_id').references(() => jobs.id).notNull(),
  senderId: uuid('sender_id').references(() => users.id).notNull(),
  recipientId: uuid('recipient_id').references(() => users.id).notNull(),
  
  content: text('content'),
  type: varchar('type', { length: 20 }).default('text'), // text, image, location, voice
  attachments: jsonb('attachments'),
  
  isRead: boolean('is_read').default(false),
  readAt: timestamp('read_at'),
  
  createdAt: timestamp('created_at').defaultNow()
});


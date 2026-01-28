import { pgTable, uuid, varchar, integer, timestamp } from "drizzle-orm/pg-core";
import { users } from "./users";
import { jobs } from "./jobs";
import { bids } from "./bids";

export const creditTransactions = pgTable('credit_transactions', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id).notNull(),
  
  type: varchar('type', { length: 20 }).notNull(), // purchase, spend, refund, bonus
  amount: integer('amount').notNull(), // positive or negative
  
  // Context
  jobId: uuid('job_id').references(() => jobs.id),
  bidId: uuid('bid_id').references(() => bids.id),
  purchaseId: varchar('purchase_id', { length: 255 }), // RevenueCat transaction ID
  
  description: varchar('description', { length: 255 }),
  
  createdAt: timestamp('created_at').defaultNow()
});


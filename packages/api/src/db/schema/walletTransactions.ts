import { pgTable, uuid, varchar, decimal, text, jsonb, timestamp } from "drizzle-orm/pg-core";
import { wallets } from "./wallets";
import { jobs } from "./jobs";

export const walletTransactions = pgTable('wallet_transactions', {
  id: uuid('id').primaryKey().defaultRandom(),
  walletId: uuid('wallet_id').references(() => wallets.id).notNull(),
  
  type: varchar('type', { length: 20 }).notNull(), // earning, payout, refund, hold, release
  amount: decimal('amount', { precision: 10, scale: 2 }).notNull(),
  
  // Context
  jobId: uuid('job_id').references(() => jobs.id),
  payoutId: uuid('payout_id'),
  
  description: text('description'),
  metadata: jsonb('metadata'),
  
  createdAt: timestamp('created_at').defaultNow()
});


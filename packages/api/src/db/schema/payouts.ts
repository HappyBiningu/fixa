import { pgTable, uuid, decimal, varchar, jsonb, timestamp } from "drizzle-orm/pg-core";
import { users } from "./users";

export const payouts = pgTable('payouts', {
  id: uuid('id').primaryKey().defaultRandom(),
  workerId: uuid('worker_id').references(() => users.id).notNull(),
  
  amount: decimal('amount', { precision: 10, scale: 2 }).notNull(),
  fee: decimal('fee', { precision: 10, scale: 2 }).default('0'),
  netAmount: decimal('net_amount', { precision: 10, scale: 2 }).notNull(),
  
  method: varchar('method', { length: 50 }).notNull(), // bank, mobile_money, instant_eft
  details: jsonb('details'), // Account info (encrypted)
  
  status: varchar('status', { length: 20 }).default('pending'), // pending, processing, completed, failed
  
  createdAt: timestamp('created_at').defaultNow(),
  processedAt: timestamp('processed_at'),
  completedAt: timestamp('completed_at')
});


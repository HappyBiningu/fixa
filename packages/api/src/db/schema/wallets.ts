import { pgTable, uuid, decimal, timestamp } from "drizzle-orm/pg-core";
import { users } from "./users";

export const wallets = pgTable('wallets', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id).unique().notNull(),
  
  balanceAvailable: decimal('balance_available', { precision: 10, scale: 2 }).default('0'),
  balancePending: decimal('balance_pending', { precision: 10, scale: 2 }).default('0'),
  balanceOnHold: decimal('balance_on_hold', { precision: 10, scale: 2 }).default('0'),
  lifetimeEarnings: decimal('lifetime_earnings', { precision: 10, scale: 2 }).default('0'),
  
  updatedAt: timestamp('updated_at').defaultNow()
});


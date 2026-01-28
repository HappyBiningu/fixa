import { pgTable, uuid, integer, timestamp } from "drizzle-orm/pg-core";
import { users } from "./users";

export const credits = pgTable('credits', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id).notNull().unique(),
  
  balance: integer('balance').default(0),
  lifetimePurchased: integer('lifetime_purchased').default(0),
  lifetimeSpent: integer('lifetime_spent').default(0),
  
  updatedAt: timestamp('updated_at').defaultNow()
});


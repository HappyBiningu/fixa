import { pgTable, uuid, varchar, text, decimal, real, integer, date, time, jsonb, timestamp } from "drizzle-orm/pg-core";
import { users } from "./users";
import { categories } from "./categories";

export const jobs = pgTable('jobs', {
  id: uuid('id').primaryKey().defaultRandom(),
  clientId: uuid('client_id').references(() => users.id).notNull(),
  categoryId: uuid('category_id').references(() => categories.id).notNull(),
  
  // Job Details
  title: varchar('title', { length: 100 }).notNull(),
  description: text('description').notNull(),
  
  // Budget
  budgetType: varchar('budget_type', { length: 20 }).notNull(), // fixed, hourly, negotiable
  budgetAmount: decimal('budget_amount', { precision: 10, scale: 2 }),
  budgetMin: decimal('budget_min', { precision: 10, scale: 2 }),
  budgetMax: decimal('budget_max', { precision: 10, scale: 2 }),
  
  // Location
  locationLat: real('location_lat').notNull(),
  locationLng: real('location_lng').notNull(),
  locationAddress: text('location_address'),
  visibilityRadius: integer('visibility_radius').default(10), // km
  
  // Timing
  urgency: varchar('urgency', { length: 20 }).notNull(),
  preferredDate: date('preferred_date'),
  preferredTime: time('preferred_time'),
  
  // Media
  photos: jsonb('photos'), // Array of URLs
  
  // Status
  status: varchar('status', { length: 20 }).default('open'),
  hiredWorkerId: uuid('hired_worker_id').references(() => users.id),
  
  // Metrics
  viewsCount: integer('views_count').default(0),
  bidsCount: integer('bids_count').default(0),
  
  // Timestamps
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
  expiresAt: timestamp('expires_at'),
  completedAt: timestamp('completed_at')
});


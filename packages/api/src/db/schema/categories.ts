import { pgTable, uuid, varchar, boolean, integer, timestamp } from "drizzle-orm/pg-core";

export const categories = pgTable('categories', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 100 }).notNull(),
  slug: varchar('slug', { length: 100 }).unique().notNull(),
  icon: varchar('icon', { length: 50 }),
  parentId: uuid('parent_id').references(() => categories.id),
  
  isActive: boolean('is_active').default(true),
  sortOrder: integer('sort_order').default(0),
  
  createdAt: timestamp('created_at').defaultNow()
});


import { pgTable, uuid, varchar, text, real, integer, boolean, timestamp } from "drizzle-orm/pg-core";

export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  phone: varchar('phone', { length: 20 }).unique().notNull(),
  email: varchar('email', { length: 255 }).unique(),
  passwordHash: varchar('password_hash', { length: 255 }),
  
  role: varchar('role', { length: 20 }).notNull().default('client'), // 'client', 'worker', 'both', 'admin'
  
  // Profile
  fullName: varchar('full_name', { length: 100 }),
  profilePhoto: varchar('profile_photo', { length: 500 }),
  bio: text('bio'),
  
  // Location
  locationLat: real('location_lat'),
  locationLng: real('location_lng'),
  locationAddress: text('location_address'),
  serviceRadius: integer('service_radius'), // km, for workers
  
  // Verification
  phoneVerified: boolean('phone_verified').default(false),
  emailVerified: boolean('email_verified').default(false),
  idVerified: boolean('id_verified').default(false),
  selfieVerified: boolean('selfie_verified').default(false),
  
  // Subscription
  subscriptionTier: varchar('subscription_tier', { length: 20 }).default('free'),
  subscriptionExpiresAt: timestamp('subscription_expires_at'),
  
  // Status
  status: varchar('status', { length: 20 }).default('active'), // active, suspended, banned
  trustScore: integer('trust_score').default(50),
  
  // Timestamps
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
  lastActiveAt: timestamp('last_active_at'),
});


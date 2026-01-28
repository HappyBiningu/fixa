import { db } from "./index";
import { users, workerProfiles, credits, wallets, categories } from "./schema";
import { hashPassword } from "../utils/bcrypt";
import { eq } from "drizzle-orm";

async function seed() {
  console.log("🌱 Starting database seed...");

  try {
    // Hash a common password for demo accounts
    const demoPassword = await hashPassword("demo123");

    // 1. Create Admin Account
    console.log("Creating admin account...");
    let admin;
    const existingAdmin = await db
      .select()
      .from(users)
      .where(eq(users.phone, "+27123456789"))
      .limit(1);

    if (existingAdmin.length > 0) {
      admin = existingAdmin[0];
      console.log(`ℹ️  Admin already exists: ${admin.id}`);
    } else {
      [admin] = await db
        .insert(users)
        .values({
          phone: "+27123456789",
          email: "admin@fixa.com",
          passwordHash: demoPassword,
          role: "admin",
          fullName: "Admin User",
          phoneVerified: true,
          emailVerified: true,
          status: "active",
          trustScore: 100,
        })
        .returning();
      console.log(`✅ Admin created: ${admin.id}`);
    }

    // 2. Create Client Account
    console.log("Creating client account...");
    let client;
    const existingClient = await db
      .select()
      .from(users)
      .where(eq(users.phone, "+27123456790"))
      .limit(1);

    if (existingClient.length > 0) {
      client = existingClient[0];
      console.log(`ℹ️  Client already exists: ${client.id}`);
    } else {
      [client] = await db
        .insert(users)
        .values({
          phone: "+27123456790",
          email: "client@fixa.com",
          passwordHash: demoPassword,
          role: "client",
          fullName: "John Client",
          phoneVerified: true,
          emailVerified: true,
          status: "active",
          trustScore: 75,
          locationLat: -25.7479, // Pretoria coordinates
          locationLng: 28.2293,
          locationAddress: "Hatfield, Pretoria",
        })
        .returning();

      // Create wallet for client
      await db.insert(wallets).values({
        userId: client.id,
        balanceAvailable: "0",
        balancePending: "0",
        balanceOnHold: "0",
        lifetimeEarnings: "0",
      });

      console.log(`✅ Client created: ${client.id}`);
    }

    // 3. Create Worker Account
    console.log("Creating worker account...");
    let worker;
    const existingWorker = await db
      .select()
      .from(users)
      .where(eq(users.phone, "+27123456791"))
      .limit(1);

    if (existingWorker.length > 0) {
      worker = existingWorker[0];
      console.log(`ℹ️  Worker already exists: ${worker.id}`);
    } else {
      [worker] = await db
        .insert(users)
        .values({
          phone: "+27123456791",
          email: "worker@fixa.com",
          passwordHash: demoPassword,
          role: "worker",
          fullName: "Sarah Worker",
          phoneVerified: true,
          emailVerified: true,
          status: "active",
          trustScore: 85,
          locationLat: -25.7479, // Pretoria coordinates
          locationLng: 28.2293,
          locationAddress: "Hatfield, Pretoria",
          serviceRadius: 20, // 20km service radius
        })
        .returning();

      // Create worker profile
      await db.insert(workerProfiles).values({
        userId: worker.id,
        skills: ["cleaning", "gardening", "plumbing"], // Category IDs would go here
        experienceLevel: "intermediate",
        hourlyRateMin: "150",
        hourlyRateMax: "300",
        portfolio: [],
        jobsCompleted: 12,
        averageRating: 4.8,
        responseTime: 15, // minutes
        acceptanceRate: 0.95,
        completionRate: 1.0,
        totalEarnings: "8500",
        badges: ["topRated", "fastResponder", "reliable"],
      });

      // Create credits for worker
      await db.insert(credits).values({
        userId: worker.id,
        balance: 50,
        lifetimePurchased: 100,
        lifetimeSpent: 50,
      });

      // Create wallet for worker
      await db.insert(wallets).values({
        userId: worker.id,
        balanceAvailable: "2500",
        balancePending: "500",
        balanceOnHold: "0",
        lifetimeEarnings: "8500",
      });

      console.log(`✅ Worker created: ${worker.id}`);
    }

    // 4. Seed Categories
    console.log("Creating categories...");
    const categoryData = [
      { name: "Home Services", slug: "home-services", icon: "🏠", sortOrder: 1 },
      { name: "Cleaning", slug: "cleaning", icon: "🧹", sortOrder: 2 },
      { name: "Gardening", slug: "gardening", icon: "🌳", sortOrder: 3 },
      { name: "Plumbing", slug: "plumbing", icon: "🔧", sortOrder: 4 },
      { name: "Electrical", slug: "electrical", icon: "⚡", sortOrder: 5 },
      { name: "Painting", slug: "painting", icon: "🎨", sortOrder: 6 },
      { name: "Carpentry", slug: "carpentry", icon: "🪚", sortOrder: 7 },
      { name: "Transport & Delivery", slug: "transport", icon: "🚗", sortOrder: 8 },
      { name: "Repairs & Maintenance", slug: "repairs", icon: "🔧", sortOrder: 9 },
      { name: "Digital Services", slug: "digital", icon: "💻", sortOrder: 10 },
      { name: "Lessons & Training", slug: "lessons", icon: "🎓", sortOrder: 11 },
      { name: "Events", slug: "events", icon: "🎉", sortOrder: 12 },
      { name: "Pet Services", slug: "pet-services", icon: "🐕", sortOrder: 13 },
      { name: "Beauty & Wellness", slug: "beauty", icon: "💅", sortOrder: 14 },
      { name: "Other", slug: "other", icon: "📋", sortOrder: 15 },
    ];

    for (const cat of categoryData) {
      const existing = await db
        .select()
        .from(categories)
        .where(eq(categories.slug, cat.slug))
        .limit(1);

      if (existing.length === 0) {
        await db.insert(categories).values(cat);
      }
    }

    console.log("✅ Categories created");

    console.log("\n🎉 Seed completed successfully!");
    console.log("\n📋 Demo Accounts:");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("👤 ADMIN:");
    console.log("   Phone: +27123456789");
    console.log("   Email: admin@fixa.com");
    console.log("   Password: demo123");
    console.log("   Role: admin");
    console.log("\n👤 CLIENT:");
    console.log("   Phone: +27123456790");
    console.log("   Email: client@fixa.com");
    console.log("   Password: demo123");
    console.log("   Role: client");
    console.log("\n👤 WORKER:");
    console.log("   Phone: +27123456791");
    console.log("   Email: worker@fixa.com");
    console.log("   Password: demo123");
    console.log("   Role: worker");
    console.log("   Credits: 50");
    console.log("   Wallet: R2,500 available");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");
  } catch (error) {
    console.error("❌ Seed failed:", error);
    throw error;
  }
}

// Run seed if called directly
if (import.meta.main) {
  seed()
    .then(() => {
      console.log("✅ Seed script completed");
      process.exit(0);
    })
    .catch((error) => {
      console.error("❌ Seed script failed:", error);
      process.exit(1);
    });
}

export { seed };


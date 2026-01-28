import { eq } from "drizzle-orm";
import { db } from "../db";
import { credits, creditTransactions } from "../db/schema";
import { sql } from "drizzle-orm";

export class CreditService {
  async getBalance(userId: string) {
    const [credit] = await db
      .select()
      .from(credits)
      .where(eq(credits.userId, userId))
      .limit(1);
    
    if (!credit) {
      // Initialize credits for new user
      const [newCredit] = await db
        .insert(credits)
        .values({
          userId,
          balance: 0,
          lifetimePurchased: 0,
          lifetimeSpent: 0,
        })
        .returning();
      
      return newCredit;
    }
    
    return credit;
  }
  
  async getTransactions(userId: string, limit: number = 50) {
    return db
      .select()
      .from(creditTransactions)
      .where(eq(creditTransactions.userId, userId))
      .orderBy(sql`${creditTransactions.createdAt} DESC`)
      .limit(limit);
  }
  
  async purchaseCredits(
    userId: string,
    amount: number,
    purchaseId: string,
    packName: string
  ) {
    // Get or create credit record
    let [credit] = await db
      .select()
      .from(credits)
      .where(eq(credits.userId, userId))
      .limit(1);
    
    if (!credit) {
      [credit] = await db
        .insert(credits)
        .values({
          userId,
          balance: 0,
          lifetimePurchased: 0,
          lifetimeSpent: 0,
        })
        .returning();
    }
    
    // Add credits
    await db
      .update(credits)
      .set({
        balance: sql`${credits.balance} + ${amount}`,
        lifetimePurchased: sql`${credits.lifetimePurchased} + ${amount}`,
      })
      .where(eq(credits.userId, userId));
    
    // Record transaction
    await db.insert(creditTransactions).values({
      userId,
      type: "purchase",
      amount,
      purchaseId,
      description: `Purchased ${packName}`,
    });
    
    return { message: "Credits added", amount };
  }
  
  async calculateBidCost(jobId: string, userId: string) {
    // This would fetch job details and calculate
    // For now, return a placeholder
    return { cost: 2 };
  }
}


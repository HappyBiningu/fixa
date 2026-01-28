import { eq, and } from "drizzle-orm";
import { db } from "../db";
import { wallets, walletTransactions, jobs, payouts } from "../db/schema";
import { sql } from "drizzle-orm";

export class WalletService {
  async getWallet(userId: string) {
    let [wallet] = await db
      .select()
      .from(wallets)
      .where(eq(wallets.userId, userId))
      .limit(1);
    
    if (!wallet) {
      [wallet] = await db
        .insert(wallets)
        .values({
          userId,
          balanceAvailable: "0",
          balancePending: "0",
          balanceOnHold: "0",
          lifetimeEarnings: "0",
        })
        .returning();
    }
    
    return wallet;
  }
  
  async getTransactions(userId: string, limit: number = 50) {
    const wallet = await this.getWallet(userId);
    
    return db
      .select()
      .from(walletTransactions)
      .where(eq(walletTransactions.walletId, wallet.id))
      .orderBy(sql`${walletTransactions.createdAt} DESC`)
      .limit(limit);
  }
  
  async processJobPayment(jobId: string) {
    const [job] = await db
      .select()
      .from(jobs)
      .where(eq(jobs.id, jobId))
      .limit(1);
    
    if (!job || !job.hiredWorkerId) {
      throw new Error("Job not found or no worker assigned");
    }
    
    if (job.status !== "pending_completion") {
      throw new Error("Job not ready for payment");
    }
    
    const jobAmount = job.budgetAmount ? parseFloat(job.budgetAmount) : 0;
    const platformFee = jobAmount * 0.15; // 15% platform fee
    const workerEarnings = jobAmount - platformFee;
    
    // Get worker wallet
    const wallet = await this.getWallet(job.hiredWorkerId);
    
    // Add to available balance
    await db
      .update(wallets)
      .set({
        balanceAvailable: sql`${wallets.balanceAvailable} + ${workerEarnings}`,
        lifetimeEarnings: sql`${wallets.lifetimeEarnings} + ${workerEarnings}`,
      })
      .where(eq(wallets.id, wallet.id));
    
    // Record transaction
    await db.insert(walletTransactions).values({
      walletId: wallet.id,
      type: "earning",
      amount: workerEarnings.toString(),
      jobId,
      description: `Payment for job: ${job.title}`,
      metadata: {
        jobAmount,
        platformFee,
        netAmount: workerEarnings,
      },
    });
    
    // Update job status
    await db
      .update(jobs)
      .set({ status: "completed" })
      .where(eq(jobs.id, jobId));
    
    return { workerEarnings, platformFee };
  }
  
  async requestPayout(
    userId: string,
    amount: number,
    method: string,
    details: Record<string, any>
  ) {
    const wallet = await this.getWallet(userId);
    
    if (parseFloat(wallet.balanceAvailable) < amount) {
      throw new Error("Insufficient balance");
    }
    
    // Create payout request
    const [payout] = await db
      .insert(payouts)
      .values({
        workerId: userId,
        amount: amount.toString(),
        fee: "0",
        netAmount: amount.toString(),
        method,
        details,
        status: "pending",
      })
      .returning();
    
    // Move from available to pending
    await db
      .update(wallets)
      .set({
        balanceAvailable: sql`${wallets.balanceAvailable} - ${amount}`,
        balancePending: sql`${wallets.balancePending} + ${amount}`,
      })
      .where(eq(wallets.id, wallet.id));
    
    // Record transaction
    await db.insert(walletTransactions).values({
      walletId: wallet.id,
      type: "payout",
      amount: (-amount).toString(),
      payoutId: payout.id,
      description: `Payout request: ${method}`,
    });
    
    return payout;
  }
}


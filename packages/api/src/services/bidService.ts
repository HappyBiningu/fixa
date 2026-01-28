import { eq, and } from "drizzle-orm";
import { db } from "../db";
import { bids, jobs, credits, creditTransactions, users, workerProfiles } from "../db/schema";
import { calculateBidCost } from "../utils/creditCalculator";
import { sql } from "drizzle-orm";

export class BidService {
  async createBid(data: {
    jobId: string;
    workerId: string;
    message: string;
    proposedAmount: number;
    estimatedDuration?: string;
    availability?: string;
  }) {
    // Get job details
    const [job] = await db
      .select()
      .from(jobs)
      .where(eq(jobs.id, data.jobId))
      .limit(1);
    
    if (!job) {
      throw new Error("Job not found");
    }
    
    if (job.status !== "open") {
      throw new Error("Job is not accepting bids");
    }
    
    // Check if worker already bid
    const existingBid = await db
      .select()
      .from(bids)
      .where(
        and(
          eq(bids.jobId, data.jobId),
          eq(bids.workerId, data.workerId),
          eq(bids.status, "pending")
        )
      )
      .limit(1);
    
    if (existingBid.length > 0) {
      throw new Error("You have already bid on this job");
    }
    
    // Get worker profile for rating snapshot
    const [workerProfile] = await db
      .select()
      .from(workerProfiles)
      .where(eq(workerProfiles.userId, data.workerId))
      .limit(1);
    
    // Get user subscription tier
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.id, data.workerId))
      .limit(1);
    
    // Calculate credit cost
    const creditCost = calculateBidCost({
      budgetAmount: job.budgetAmount ? parseFloat(job.budgetAmount) : 0,
      urgency: job.urgency,
      bidsCount: job.bidsCount || 0,
      isProWorker: user?.subscriptionTier === "pro" || user?.subscriptionTier === "elite",
    });
    
    // Check credit balance
    const [credit] = await db
      .select()
      .from(credits)
      .where(eq(credits.userId, data.workerId))
      .limit(1);
    
    if (!credit || credit.balance < creditCost) {
      throw new Error("Insufficient credits");
    }
    
    // Deduct credits
    await db
      .update(credits)
      .set({
        balance: sql`${credits.balance} - ${creditCost}`,
        lifetimeSpent: sql`${credits.lifetimeSpent} + ${creditCost}`,
      })
      .where(eq(credits.userId, data.workerId));
    
    // Record transaction
    await db.insert(creditTransactions).values({
      userId: data.workerId,
      type: "spend",
      amount: -creditCost,
      jobId: data.jobId,
      description: `Bid on job: ${job.title}`,
    });
    
    // Create bid
    const [bid] = await db
      .insert(bids)
      .values({
        jobId: data.jobId,
        workerId: data.workerId,
        message: data.message,
        proposedAmount: data.proposedAmount.toString(),
        estimatedDuration: data.estimatedDuration,
        availability: data.availability,
        creditsSpent: creditCost,
        status: "pending",
        workerRatingAtTime: workerProfile?.averageRating || 0,
        workerJobsCompletedAtTime: workerProfile?.jobsCompleted || 0,
      })
      .returning();
    
    // Update job bid count
    await db
      .update(jobs)
      .set({ bidsCount: sql`${jobs.bidsCount} + 1` })
      .where(eq(jobs.id, data.jobId));
    
    return bid;
  }
  
  async getJobBids(jobId: string, clientId: string) {
    // Verify client owns the job
    const [job] = await db
      .select()
      .from(jobs)
      .where(and(eq(jobs.id, jobId), eq(jobs.clientId, clientId)))
      .limit(1);
    
    if (!job) {
      throw new Error("Job not found or unauthorized");
    }
    
    const jobBids = await db
      .select({
        bid: bids,
        worker: users,
        workerProfile: workerProfiles,
      })
      .from(bids)
      .innerJoin(users, eq(bids.workerId, users.id))
      .leftJoin(workerProfiles, eq(workerProfiles.userId, users.id))
      .where(and(eq(bids.jobId, jobId), eq(bids.status, "pending")))
      .orderBy(bids.createdAt);
    
    return jobBids;
  }
  
  async acceptBid(bidId: string, clientId: string) {
    // Get bid with job
    const [bidData] = await db
      .select({
        bid: bids,
        job: jobs,
      })
      .from(bids)
      .innerJoin(jobs, eq(bids.jobId, jobs.id))
      .where(and(eq(bids.id, bidId), eq(jobs.clientId, clientId)))
      .limit(1);
    
    if (!bidData) {
      throw new Error("Bid not found or unauthorized");
    }
    
    if (bidData.job.status !== "open") {
      throw new Error("Job is not accepting bids");
    }
    
    // Update bid status
    await db
      .update(bids)
      .set({ status: "accepted" })
      .where(eq(bids.id, bidId));
    
    // Reject other bids
    await db
      .update(bids)
      .set({ status: "rejected" })
      .where(
        and(
          eq(bids.jobId, bidData.job.id),
          eq(bids.status, "pending"),
          sql`${bids.id} != ${bidId}`
        )
      );
    
    // Update job
    await db
      .update(jobs)
      .set({
        status: "in_progress",
        hiredWorkerId: bidData.bid.workerId,
      })
      .where(eq(jobs.id, bidData.job.id));
    
    return { message: "Bid accepted" };
  }
  
  async withdrawBid(bidId: string, workerId: string) {
    const [bid] = await db
      .select()
      .from(bids)
      .where(and(eq(bids.id, bidId), eq(bids.workerId, workerId)))
      .limit(1);
    
    if (!bid) {
      throw new Error("Bid not found");
    }
    
    if (bid.status !== "pending") {
      throw new Error("Cannot withdraw bid in current status");
    }
    
    await db
      .update(bids)
      .set({ status: "withdrawn" })
      .where(eq(bids.id, bidId));
    
    // Credits are non-refundable per blueprint
    return { message: "Bid withdrawn" };
  }
}


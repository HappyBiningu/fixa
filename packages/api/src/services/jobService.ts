import { eq, and, gte, lte, sql, desc } from "drizzle-orm";
import { db } from "../db";
import { jobs, users, categories, bids } from "../db/schema";
import { calculateDistance } from "../utils/distance";

export class JobService {
  async createJob(data: {
    clientId: string;
    categoryId: string;
    title: string;
    description: string;
    budgetType: string;
    budgetAmount?: number;
    budgetMin?: number;
    budgetMax?: number;
    locationLat: number;
    locationLng: number;
    locationAddress?: string;
    visibilityRadius?: number;
    urgency: string;
    preferredDate?: string;
    preferredTime?: string;
    photos?: string[];
  }) {
    // Set expiration (48 hours from now)
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 48);
    
    const [job] = await db
      .insert(jobs)
      .values({
        clientId: data.clientId,
        categoryId: data.categoryId,
        title: data.title,
        description: data.description,
        budgetType: data.budgetType,
        budgetAmount: data.budgetAmount?.toString(),
        budgetMin: data.budgetMin?.toString(),
        budgetMax: data.budgetMax?.toString(),
        locationLat: data.locationLat,
        locationLng: data.locationLng,
        locationAddress: data.locationAddress,
        visibilityRadius: data.visibilityRadius || 10,
        urgency: data.urgency,
        preferredDate: data.preferredDate,
        preferredTime: data.preferredTime,
        photos: data.photos || [],
        status: "open",
        expiresAt,
      })
      .returning();
    
    return job;
  }
  
  async getJobById(jobId: string) {
    const [job] = await db
      .select({
        job: jobs,
        client: users,
        category: categories,
      })
      .from(jobs)
      .innerJoin(users, eq(jobs.clientId, users.id))
      .innerJoin(categories, eq(jobs.categoryId, categories.id))
      .where(eq(jobs.id, jobId))
      .limit(1);
    
    if (!job) {
      throw new Error("Job not found");
    }
    
    // Increment views
    await db
      .update(jobs)
      .set({ viewsCount: sql`${jobs.viewsCount} + 1` })
      .where(eq(jobs.id, jobId));
    
    return job;
  }
  
  async getNearbyJobs(
    lat: number,
    lng: number,
    radius: number = 50,
    filters?: {
      categoryId?: string;
      budgetMin?: number;
      budgetMax?: number;
      urgency?: string;
    }
  ) {
    // Get all active jobs
    let query = db
      .select({
        job: jobs,
        client: users,
        category: categories,
      })
      .from(jobs)
      .innerJoin(users, eq(jobs.clientId, users.id))
      .innerJoin(categories, eq(jobs.categoryId, categories.id))
      .where(
        and(
          eq(jobs.status, "open"),
          gte(jobs.expiresAt, new Date())
        )
      );
    
    const allJobs = await query;
    
    // Filter by distance and other criteria
    const nearbyJobs = allJobs
      .map((item) => {
        const distance = calculateDistance(
          lat,
          lng,
          item.job.locationLat || 0,
          item.job.locationLng || 0
        );
        return { ...item, distance };
      })
      .filter((item) => {
        if (item.distance > radius) return false;
        if (filters?.categoryId && item.job.categoryId !== filters.categoryId) return false;
        if (filters?.budgetMin && (item.job.budgetAmount ? parseFloat(item.job.budgetAmount) : 0) < filters.budgetMin) return false;
        if (filters?.budgetMax && (item.job.budgetAmount ? parseFloat(item.job.budgetAmount) : 0) > filters.budgetMax) return false;
        if (filters?.urgency && item.job.urgency !== filters.urgency) return false;
        return true;
      })
      .sort((a, b) => a.distance - b.distance);
    
    return nearbyJobs;
  }
  
  async getMyJobs(userId: string, role: string) {
    if (role === "client" || role === "both") {
      const clientJobs = await db
        .select({
          job: jobs,
          category: categories,
        })
        .from(jobs)
        .innerJoin(categories, eq(jobs.categoryId, categories.id))
        .where(eq(jobs.clientId, userId))
        .orderBy(desc(jobs.createdAt));
      
      return clientJobs;
    }
    
    if (role === "worker" || role === "both") {
      const workerBids = await db
        .select({
          job: jobs,
          category: categories,
          bid: bids,
        })
        .from(bids)
        .innerJoin(jobs, eq(bids.jobId, jobs.id))
        .innerJoin(categories, eq(jobs.categoryId, categories.id))
        .where(eq(bids.workerId, userId))
        .orderBy(desc(bids.createdAt));
      
      return workerBids;
    }
    
    return [];
  }
  
  async cancelJob(jobId: string, userId: string) {
    const [job] = await db
      .select()
      .from(jobs)
      .where(and(eq(jobs.id, jobId), eq(jobs.clientId, userId)))
      .limit(1);
    
    if (!job) {
      throw new Error("Job not found");
    }
    
    if (job.status !== "open") {
      throw new Error("Cannot cancel job in current status");
    }
    
    await db
      .update(jobs)
      .set({ status: "cancelled" })
      .where(eq(jobs.id, jobId));
    
    return { message: "Job cancelled" };
  }
  
  async completeJob(jobId: string, userId: string, role: string) {
    const [job] = await db
      .select()
      .from(jobs)
      .where(eq(jobs.id, jobId))
      .limit(1);
    
    if (!job) {
      throw new Error("Job not found");
    }
    
    if (role === "client") {
      if (job.clientId !== userId) {
        throw new Error("Unauthorized");
      }
      await db
        .update(jobs)
        .set({ status: "pending_completion" })
        .where(eq(jobs.id, jobId));
    } else if (role === "worker") {
      if (job.hiredWorkerId !== userId) {
        throw new Error("Unauthorized");
      }
      await db
        .update(jobs)
        .set({ status: "pending_completion", completedAt: new Date() })
        .where(eq(jobs.id, jobId));
    }
    
    return { message: "Job marked as complete" };
  }
}


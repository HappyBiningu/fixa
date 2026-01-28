import { eq, and } from "drizzle-orm";
import { db } from "../db";
import { ratings, jobs, users, workerProfiles } from "../db/schema";
import { sql } from "drizzle-orm";

export class RatingService {
  async createRating(data: {
    jobId: string;
    fromUserId: string;
    toUserId: string;
    overallRating: number;
    qualityRating?: number;
    professionalismRating?: number;
    communicationRating?: number;
    punctualityRating?: number;
    valueRating?: number;
    review?: string;
  }) {
    // Verify job exists and user is part of it
    const [job] = await db
      .select()
      .from(jobs)
      .where(eq(jobs.id, data.jobId))
      .limit(1);
    
    if (!job) {
      throw new Error("Job not found");
    }
    
    if (job.clientId !== data.fromUserId && job.hiredWorkerId !== data.fromUserId) {
      throw new Error("Unauthorized");
    }
    
    if (job.clientId !== data.toUserId && job.hiredWorkerId !== data.toUserId) {
      throw new Error("Invalid rating target");
    }
    
    // Check if rating already exists
    const existing = await db
      .select()
      .from(ratings)
      .where(
        and(
          eq(ratings.jobId, data.jobId),
          eq(ratings.fromUserId, data.fromUserId)
        )
      )
      .limit(1);
    
    if (existing.length > 0) {
      throw new Error("Rating already exists");
    }
    
    // Create rating
    const [rating] = await db
      .insert(ratings)
      .values({
        jobId: data.jobId,
        fromUserId: data.fromUserId,
        toUserId: data.toUserId,
        overallRating: data.overallRating,
        qualityRating: data.qualityRating,
        professionalismRating: data.professionalismRating,
        communicationRating: data.communicationRating,
        punctualityRating: data.punctualityRating,
        valueRating: data.valueRating,
        review: data.review,
      })
      .returning();
    
    // Update worker profile if rating is for worker
    const [toUser] = await db
      .select()
      .from(users)
      .where(eq(users.id, data.toUserId))
      .limit(1);
    
    if (toUser && (toUser.role === "worker" || toUser.role === "both")) {
      // Calculate new average rating
      const allRatings = await db
        .select()
        .from(ratings)
        .where(eq(ratings.toUserId, data.toUserId));
      
      const avgRating = allRatings.reduce((sum, r) => sum + r.overallRating, 0) / allRatings.length;
      
      await db
        .update(workerProfiles)
        .set({ averageRating: avgRating })
        .where(eq(workerProfiles.userId, data.toUserId));
    }
    
    return rating;
  }
  
  async getRatings(userId: string) {
    return db
      .select()
      .from(ratings)
      .where(eq(ratings.toUserId, userId))
      .orderBy(sql`${ratings.createdAt} DESC`);
  }
}


import { eq, and } from "drizzle-orm";
import { db } from "../db";
import { messages, jobs } from "../db/schema";

export class MessageService {
  async sendMessage(data: {
    jobId: string;
    senderId: string;
    recipientId: string;
    content: string;
    type?: string;
    attachments?: any[];
  }) {
    // Verify sender is part of the job
    const [job] = await db
      .select()
      .from(jobs)
      .where(eq(jobs.id, data.jobId))
      .limit(1);
    
    if (!job) {
      throw new Error("Job not found");
    }
    
    if (job.clientId !== data.senderId && job.hiredWorkerId !== data.senderId) {
      throw new Error("Unauthorized");
    }
    
    const [message] = await db
      .insert(messages)
      .values({
        jobId: data.jobId,
        senderId: data.senderId,
        recipientId: data.recipientId,
        content: data.content,
        type: data.type || "text",
        attachments: data.attachments || [],
      })
      .returning();
    
    return message;
  }
  
  async getMessages(jobId: string, userId: string) {
    // Verify user is part of the job
    const [job] = await db
      .select()
      .from(jobs)
      .where(eq(jobs.id, jobId))
      .limit(1);
    
    if (!job) {
      throw new Error("Job not found");
    }
    
    if (job.clientId !== userId && job.hiredWorkerId !== userId) {
      throw new Error("Unauthorized");
    }
    
    return db
      .select()
      .from(messages)
      .where(eq(messages.jobId, jobId))
      .orderBy(messages.createdAt);
  }
  
  async markAsRead(messageId: string, userId: string) {
    await db
      .update(messages)
      .set({ isRead: true, readAt: new Date() })
      .where(
        and(
          eq(messages.id, messageId),
          eq(messages.recipientId, userId)
        )
      );
    
    return { message: "Marked as read" };
  }
}


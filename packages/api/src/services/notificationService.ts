import { eq } from "drizzle-orm";
import { db } from "../db";
import { notifications } from "../db/schema";

export class NotificationService {
  async createNotification(data: {
    userId: string;
    type: string;
    title: string;
    message: string;
    jobId?: string;
    bidId?: string;
    actionUrl?: string;
    imageUrl?: string;
  }) {
    const [notification] = await db
      .insert(notifications)
      .values(data)
      .returning();
    
    return notification;
  }
  
  async getUserNotifications(userId: string, limit: number = 50) {
    return db
      .select()
      .from(notifications)
      .where(eq(notifications.userId, userId))
      .orderBy(notifications.createdAt)
      .limit(limit);
  }
  
  async markAsRead(notificationId: string, userId: string) {
    await db
      .update(notifications)
      .set({ isRead: true, readAt: new Date() })
      .where(
        eq(notifications.id, notificationId)
      );
    
    return { message: "Marked as read" };
  }
}


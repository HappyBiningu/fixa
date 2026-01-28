import { Response } from "express";
import { AuthRequest } from "../middleware/auth";
import { eq } from "drizzle-orm";
import { db } from "../db";
import { users } from "../db/schema";

export async function updateProfile(req: AuthRequest, res: Response) {
  try {
    if (!req.userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    
    const { fullName, email, bio } = req.body;
    
    const [updated] = await db
      .update(users)
      .set({
        fullName,
        email,
        bio,
        updatedAt: new Date(),
      })
      .where(eq(users.id, req.userId))
      .returning();
    
    res.json(updated);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
}

export async function deactivateAccount(req: AuthRequest, res: Response) {
  try {
    if (!req.userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    
    await db
      .update(users)
      .set({
        status: "suspended",
        updatedAt: new Date(),
      })
      .where(eq(users.id, req.userId));
    
    res.json({ message: "Account deactivated successfully" });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
}

export async function deleteAccount(req: AuthRequest, res: Response) {
  try {
    if (!req.userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    
    // In production, you might want to soft delete or schedule for deletion
    // For now, we'll mark as deleted
    await db
      .update(users)
      .set({
        status: "banned",
        updatedAt: new Date(),
      })
      .where(eq(users.id, req.userId));
    
    res.json({ message: "Account deletion request submitted. Account will be permanently deleted within 7 days." });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
}


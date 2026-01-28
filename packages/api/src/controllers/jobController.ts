import { Response } from "express";
import { AuthRequest } from "../middleware/auth";
import { JobService } from "../services/jobService";

const jobService = new JobService();

export async function createJob(req: AuthRequest, res: Response) {
  try {
    if (!req.userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    
    const job = await jobService.createJob({
      ...req.body,
      clientId: req.userId,
    });
    
    res.status(201).json(job);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
}

export async function getJob(req: AuthRequest, res: Response) {
  try {
    const { id } = req.params;
    const job = await jobService.getJobById(id);
    res.json(job);
  } catch (error: any) {
    res.status(404).json({ error: error.message });
  }
}

export async function getNearbyJobs(req: AuthRequest, res: Response) {
  try {
    const { lat, lng, radius, categoryId, budgetMin, budgetMax, urgency } = req.query;
    
    if (!lat || !lng) {
      return res.status(400).json({ error: "Latitude and longitude are required" });
    }
    
    const jobs = await jobService.getNearbyJobs(
      parseFloat(lat as string),
      parseFloat(lng as string),
      radius ? parseFloat(radius as string) : 50,
      {
        categoryId: categoryId as string,
        budgetMin: budgetMin ? parseFloat(budgetMin as string) : undefined,
        budgetMax: budgetMax ? parseFloat(budgetMax as string) : undefined,
        urgency: urgency as string,
      }
    );
    
    res.json(jobs);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
}

export async function getMyJobs(req: AuthRequest, res: Response) {
  try {
    if (!req.userId || !req.userRole) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    
    const myJobs = await jobService.getMyJobs(req.userId, req.userRole);
    res.json(myJobs);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
}

export async function cancelJob(req: AuthRequest, res: Response) {
  try {
    if (!req.userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    
    const { id } = req.params;
    const result = await jobService.cancelJob(id, req.userId);
    res.json(result);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
}

export async function completeJob(req: AuthRequest, res: Response) {
  try {
    if (!req.userId || !req.userRole) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    
    const { id } = req.params;
    const result = await jobService.completeJob(id, req.userId, req.userRole);
    res.json(result);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
}


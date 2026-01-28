import { Response } from "express";
import { AuthRequest } from "../middleware/auth";
import { BidService } from "../services/bidService";

const bidService = new BidService();

export async function createBid(req: AuthRequest, res: Response) {
  try {
    if (!req.userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    
    const { jobId } = req.params;
    const bid = await bidService.createBid({
      ...req.body,
      jobId,
      workerId: req.userId,
    });
    
    res.status(201).json(bid);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
}

export async function getJobBids(req: AuthRequest, res: Response) {
  try {
    if (!req.userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    
    const { jobId } = req.params;
    const bids = await bidService.getJobBids(jobId, req.userId);
    res.json(bids);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
}

export async function acceptBid(req: AuthRequest, res: Response) {
  try {
    if (!req.userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    
    const { id } = req.params;
    const result = await bidService.acceptBid(id, req.userId);
    res.json(result);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
}

export async function withdrawBid(req: AuthRequest, res: Response) {
  try {
    if (!req.userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    
    const { id } = req.params;
    const result = await bidService.withdrawBid(id, req.userId);
    res.json(result);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
}


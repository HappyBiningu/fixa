import { Response } from "express";
import { AuthRequest } from "../middleware/auth";
import { CreditService } from "../services/creditService";

const creditService = new CreditService();

export async function getBalance(req: AuthRequest, res: Response) {
  try {
    if (!req.userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    
    const balance = await creditService.getBalance(req.userId);
    res.json(balance);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
}

export async function getTransactions(req: AuthRequest, res: Response) {
  try {
    if (!req.userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    
    const transactions = await creditService.getTransactions(req.userId);
    res.json(transactions);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
}

export async function purchaseCredits(req: AuthRequest, res: Response) {
  try {
    if (!req.userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    
    const { amount, purchaseId, packName } = req.body;
    
    if (!amount || !purchaseId) {
      return res.status(400).json({ error: "Amount and purchaseId are required" });
    }
    
    const result = await creditService.purchaseCredits(
      req.userId,
      amount,
      purchaseId,
      packName || "Credit Pack"
    );
    
    res.json(result);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
}

export async function calculateBidCost(req: AuthRequest, res: Response) {
  try {
    if (!req.userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    
    const { jobId } = req.params;
    const result = await creditService.calculateBidCost(jobId, req.userId);
    res.json(result);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
}


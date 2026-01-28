import { Response } from "express";
import { AuthRequest } from "../middleware/auth";
import { WalletService } from "../services/walletService";

const walletService = new WalletService();

export async function getWallet(req: AuthRequest, res: Response) {
  try {
    if (!req.userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    
    const wallet = await walletService.getWallet(req.userId);
    res.json(wallet);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
}

export async function getTransactions(req: AuthRequest, res: Response) {
  try {
    if (!req.userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    
    const transactions = await walletService.getTransactions(req.userId);
    res.json(transactions);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
}

export async function requestPayout(req: AuthRequest, res: Response) {
  try {
    if (!req.userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    
    const { amount, method, details } = req.body;
    
    if (!amount || !method || !details) {
      return res.status(400).json({ error: "Amount, method, and details are required" });
    }
    
    const payout = await walletService.requestPayout(
      req.userId,
      amount,
      method,
      details
    );
    
    res.json(payout);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
}


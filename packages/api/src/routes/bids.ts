import { Router } from "express";
import * as bidController from "../controllers/bidController";
import { BidService } from "../services/bidService";
import { authenticate } from "../middleware/auth";

const router = Router();
const bidService = new BidService();

router.post("/jobs/:jobId/bids", authenticate, bidController.createBid);
router.get("/jobs/:jobId/bids", authenticate, bidController.getJobBids);
router.get("/my-bids", authenticate, async (req: any, res) => {
  try {
    if (!req.userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    
    const { BidService } = await import("../services/bidService");
    const bidService = new BidService();
    
    // Get all bids for this worker
    const bids = await bidService.getMyBids(req.userId);
    res.json(bids);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});
router.post("/:id/accept", authenticate, bidController.acceptBid);
router.post("/:id/withdraw", authenticate, bidController.withdrawBid);

export default router;


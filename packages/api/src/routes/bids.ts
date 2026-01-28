import { Router } from "express";
import * as bidController from "../controllers/bidController";
import { authenticate } from "../middleware/auth";

const router = Router();

router.post("/jobs/:jobId/bids", authenticate, bidController.createBid);
router.get("/jobs/:jobId/bids", authenticate, bidController.getJobBids);
router.post("/:id/accept", authenticate, bidController.acceptBid);
router.post("/:id/withdraw", authenticate, bidController.withdrawBid);

export default router;


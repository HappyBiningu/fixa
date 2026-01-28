import { Router } from "express";
import * as creditController from "../controllers/creditController";
import { authenticate } from "../middleware/auth";

const router = Router();

router.get("/balance", authenticate, creditController.getBalance);
router.get("/transactions", authenticate, creditController.getTransactions);
router.post("/purchase", authenticate, creditController.purchaseCredits);
router.get("/calculate-bid-cost/:jobId", authenticate, creditController.calculateBidCost);

export default router;


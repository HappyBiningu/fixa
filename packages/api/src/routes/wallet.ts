import { Router } from "express";
import * as walletController from "../controllers/walletController";
import { authenticate } from "../middleware/auth";

const router = Router();

router.get("/", authenticate, walletController.getWallet);
router.get("/transactions", authenticate, walletController.getTransactions);
router.post("/payout", authenticate, walletController.requestPayout);

export default router;


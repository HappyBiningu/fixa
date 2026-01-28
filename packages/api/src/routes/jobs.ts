import { Router } from "express";
import * as jobController from "../controllers/jobController";
import { authenticate } from "../middleware/auth";

const router = Router();

router.get("/nearby", authenticate, jobController.getNearbyJobs);
router.get("/my-posts", authenticate, jobController.getMyJobs);
router.get("/:id", authenticate, jobController.getJob);
router.post("/", authenticate, jobController.createJob);
router.post("/:id/cancel", authenticate, jobController.cancelJob);
router.post("/:id/complete", authenticate, jobController.completeJob);

export default router;


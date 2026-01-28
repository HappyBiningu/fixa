import { Router } from "express";
import { authenticate } from "../middleware/auth";
import { RatingService } from "../services/ratingService";

const router = Router();
const ratingService = new RatingService();

router.post("/jobs/:jobId/rate", authenticate, async (req: any, res) => {
  try {
    if (!req.userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    
    const { jobId } = req.params;
    const rating = await ratingService.createRating({
      ...req.body,
      jobId,
      fromUserId: req.userId,
    });
    
    res.json(rating);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

router.get("/received", authenticate, async (req: any, res) => {
  try {
    if (!req.userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    
    const ratings = await ratingService.getRatings(req.userId);
    res.json(ratings);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

export default router;


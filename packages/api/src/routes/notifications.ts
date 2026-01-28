import { Router } from "express";
import { authenticate } from "../middleware/auth";
import { NotificationService } from "../services/notificationService";

const router = Router();
const notificationService = new NotificationService();

router.get("/", authenticate, async (req: any, res) => {
  try {
    if (!req.userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    
    const notifications = await notificationService.getUserNotifications(req.userId);
    res.json(notifications);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

router.put("/:id/read", authenticate, async (req: any, res) => {
  try {
    if (!req.userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    
    const { id } = req.params;
    const result = await notificationService.markAsRead(id, req.userId);
    res.json(result);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

export default router;


import { Router } from "express";
import { authenticate } from "../middleware/auth";
import { MessageService } from "../services/messageService";

const router = Router();
const messageService = new MessageService();

router.get("/jobs/:jobId/messages", authenticate, async (req: any, res) => {
  try {
    if (!req.userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    
    const { jobId } = req.params;
    const messages = await messageService.getMessages(jobId, req.userId);
    res.json(messages);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

router.post("/jobs/:jobId/messages", authenticate, async (req: any, res) => {
  try {
    if (!req.userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    
    const { jobId } = req.params;
    const message = await messageService.sendMessage({
      ...req.body,
      jobId,
      senderId: req.userId,
    });
    
    res.json(message);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

export default router;


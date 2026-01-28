import { Router } from "express";
import { CategoryService } from "../services/categoryService";

const router = Router();
const categoryService = new CategoryService();

router.get("/", async (req, res) => {
  try {
    const categories = await categoryService.getAllCategories();
    res.json(categories);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const category = await categoryService.getCategoryById(id);
    if (!category) {
      return res.status(404).json({ error: "Category not found" });
    }
    res.json(category);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

export default router;


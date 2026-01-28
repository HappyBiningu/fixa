import { eq } from "drizzle-orm";
import { db } from "../db";
import { categories } from "../db/schema";

export class CategoryService {
  async getAllCategories() {
    return db
      .select()
      .from(categories)
      .where(eq(categories.isActive, true))
      .orderBy(categories.sortOrder);
  }
  
  async getCategoryById(id: string) {
    const [category] = await db
      .select()
      .from(categories)
      .where(eq(categories.id, id))
      .limit(1);
    
    return category;
  }
  
  async seedCategories() {
    // Seed initial categories from blueprint
    const categoryData = [
      { name: "Home Services", slug: "home-services", icon: "🏠", parentId: null },
      { name: "Cleaning", slug: "cleaning", icon: "🧹", parentId: null },
      { name: "Gardening", slug: "gardening", icon: "🌳", parentId: null },
      { name: "Plumbing", slug: "plumbing", icon: "🔧", parentId: null },
      { name: "Electrical", slug: "electrical", icon: "⚡", parentId: null },
      { name: "Painting", slug: "painting", icon: "🎨", parentId: null },
      { name: "Carpentry", slug: "carpentry", icon: "🪚", parentId: null },
      { name: "Transport & Delivery", slug: "transport", icon: "🚗", parentId: null },
      { name: "Repairs & Maintenance", slug: "repairs", icon: "🔧", parentId: null },
      { name: "Digital Services", slug: "digital", icon: "💻", parentId: null },
      { name: "Lessons & Training", slug: "lessons", icon: "🎓", parentId: null },
      { name: "Events", slug: "events", icon: "🎉", parentId: null },
      { name: "Pet Services", slug: "pet-services", icon: "🐕", parentId: null },
      { name: "Beauty & Wellness", slug: "beauty", icon: "💅", parentId: null },
      { name: "Other", slug: "other", icon: "📋", parentId: null },
    ];
    
    // This would insert categories if they don't exist
    // Implementation depends on your needs
    return categoryData;
  }
}


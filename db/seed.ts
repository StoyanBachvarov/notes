import "dotenv/config";
import { db } from "./index";
import { notes } from "./schema";

const sampleNotes = [
  {
    title: "Learning Next.js 15",
    content: "Next.js 15 brings React 19 support and improvements to hydration.",
    tags: ["nextjs", "react", "programming"],
  },
  {
    title: "Grocery List",
    content: "Milk, Eggs, Bread, Butter, Coffee.",
    tags: ["personal", "shopping"],
  },
  {
    title: "Workout Routine",
    content: "Monday: Chest and Triceps, Tuesday: Back and Biceps, Wednesday: Rest.",
    tags: ["personal", "health"],
  },
  {
    title: "Drizzle ORM Rocks",
    content: "Drizzle ORM is a great alternative to Prisma with better typing and SQL-like syntax.",
    tags: ["database", "typescript", "orm"],
  },
  {
    title: "Movie Recommendations",
    content: "1. The Matrix 2. Inception 3. Interstellar.",
    tags: ["entertainment", "movies"],
  },
  {
    title: "Meeting Notes",
    content: "Discuss quarterly goals and budget allocation for Q3.",
    tags: ["work", "meeting"],
  }
];

async function seed() {
  console.log("Seeding database...");
  try {
    await db.insert(notes).values(sampleNotes);
    console.log("Seeding completed successfully!");
  } catch (error) {
    console.error("Error seeding database:", error);
  }
  process.exit(0);
}

seed();
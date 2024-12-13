import type { Express, Request } from "express";
import { createServer } from "http";
import { db } from "../db";
import { posts, users } from "@db/schema";
import { eq } from "drizzle-orm";

// Extend Express Request type to include session
declare module "express-session" {
  interface SessionData {
    userId: string;
  }
}

interface AuthRequest extends Request {
  session: {
    userId?: string;
  };
}

export function registerRoutes(app: Express) {
  // Get all posts
  app.get("/api/posts", async (req, res) => {
    const allPosts = await db.query.posts.findMany({
      with: {
        author: true,
      },
      orderBy: (posts, { desc }) => [desc(posts.created_at)],
    });
    res.json(allPosts);
  });

  // Get user's posts
  app.get("/api/posts/user", async (req: AuthRequest, res) => {
    const userId = req.session.userId;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const userPosts = await db.query.posts.findMany({
      where: eq(posts.author_id, userId),
      orderBy: (posts, { desc }) => [desc(posts.created_at)],
    });
    res.json(userPosts);
  });

  // Create post
  app.post("/api/posts", async (req: AuthRequest, res) => {
    const userId = req.session.userId;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const post = await db.insert(posts).values({
      ...req.body,
      author_id: userId,
    });
    res.json(post);
  });

  // Get profile
  app.get("/api/profile", async (req: AuthRequest, res) => {
    const userId = req.session.userId;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const user = await db.query.users.findFirst({
      where: eq(users.id, userId),
    });
    res.json(user);
  });

  // Update profile
  app.put("/api/profile", async (req: AuthRequest, res) => {
    const userId = req.session.userId;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const user = await db.update(users)
      .set(req.body)
      .where(eq(users.id, userId));
    res.json(user);
  });

  const httpServer = createServer(app);
  return httpServer;
}

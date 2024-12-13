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

  // Handle auth callback and session setup
  app.post("/api/auth/callback", async (req: AuthRequest, res) => {
    const { id, email, name } = req.body;
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({ message: "No authorization header" });
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    try {
      // Set the session
      req.session.userId = id;
      
      const existingUser = await db.query.users.findFirst({
        where: eq(users.id, id),
      });

      if (existingUser) {
        const updatedUser = await db
          .update(users)
          .set({ email, name, updated_at: new Date() })
          .where(eq(users.id, id))
          .returning();
        return res.json(updatedUser[0]);
      }

      const newUser = await db
        .insert(users)
        .values({ id, email, name })
        .returning();
      return res.json(newUser[0]);
    } catch (error: any) {
      console.error("Error creating/updating user:", error);
      return res.status(500).json({ message: "Failed to create/update user" });
    }
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

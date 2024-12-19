import { relations } from "drizzle-orm";
import { pgTable, text, serial, timestamp, uuid, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: uuid("id").primaryKey(),
  email: text("email").unique().notNull(),
  name: text("name").notNull(),
  avatar_url: text("avatar_url"),
  bio: text("bio"),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow(),
});

export const posts = pgTable("posts", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  content: text("html_content").notNull(),
  author_id: uuid("author_id")
    .references(() => users.id)
    .notNull(),
  cover_image: text("cover_image"),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow(),
  published: boolean("published").default(true),
  slug: text("slug").unique().notNull(),
  excerpt: text("excerpt"),
});

// Define relationships
export const usersRelations = relations(users, ({ many }) => ({
  posts: many(posts),
}));

export const postsRelations = relations(posts, ({ one }) => ({
  author: one(users, {
    fields: [posts.author_id],
    references: [users.id],
  }),
}));

// Create Zod schemas with additional validation
export const insertUserSchema = createInsertSchema(users, {
  email: z.string().email("Invalid email address"),
  name: z.string().min(2, "Name must be at least 2 characters"),
  bio: z.string().max(500, "Bio must be less than 500 characters").optional(),
});

export const selectUserSchema = createSelectSchema(users);

export const insertPostSchema = createInsertSchema(posts, {
  title: z.string().min(1, "Title is required").max(100, "Title is too long"),
  content: z.string().min(1, "Content is required"),
});

export const selectPostSchema = createSelectSchema(posts);

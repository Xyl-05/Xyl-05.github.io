import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const contentItems = sqliteTable("content_items", {
  id: text("id").primaryKey(),
  kind: text("kind").notNull(),
  title: text("title").notNull(),
  subtitle: text("subtitle"),
  note: text("note"),
  imageKey: text("image_key"),
  imageName: text("image_name"),
  createdBy: text("created_by").notNull(),
  createdAt: integer("created_at").notNull(),
  updatedAt: integer("updated_at").notNull(),
});

export const editors = sqliteTable("editors", {
  userId: text("user_id").primaryKey(),
  email: text("email").notNull().unique(),
  displayName: text("display_name").notNull(),
  role: text("role").notNull(),
  invitedBy: text("invited_by"),
  createdAt: integer("created_at").notNull(),
});

export const editorInvites = sqliteTable("editor_invites", {
  email: text("email").primaryKey(),
  invitedBy: text("invited_by").notNull(),
  createdAt: integer("created_at").notNull(),
});

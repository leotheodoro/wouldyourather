import { jsonb, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import type { ArchetypeProfile, HistoryItem } from "@/types";

export const sharedProfiles = pgTable("shared_profiles", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  profile: jsonb("profile").$type<ArchetypeProfile>().notNull(),
  history: jsonb("history").$type<HistoryItem[]>().notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const tables = { sharedProfiles };

import { sql } from "drizzle-orm";
import {
  pgTable,
  text,
  varchar,
  timestamp,
  jsonb,
  index,
  integer,
} from "drizzle-orm/pg-core";

// 用户数据表 - 通过 token 区分不同用户
export const userData = pgTable(
  "user_data",
  {
    id: varchar("id", { length: 36 })
      .primaryKey()
      .default(sql`gen_random_uuid()`),
    token: varchar("token", { length: 64 }).notNull().unique(),
    prompts: jsonb("prompts").notNull().default("[]"),
    memo: text("memo").default(""),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    index("user_data_token_idx").on(table.token),
  ]
);

// 系统健康检查表（必须保留）
export const healthCheck = pgTable("health_check", {
  id: integer("id").primaryKey(),
  updatedAt: timestamp("updated_at", { withTimezone: true }),
});

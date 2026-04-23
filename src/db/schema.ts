import { pgTable, serial, text, timestamp, varchar } from "drizzle-orm/pg-core";

export const reservations = pgTable("reservations", {
  id: serial("id").primaryKey(),
  reservationId: varchar("reservation_id", { length: 20 }).notNull().unique(),
  fullName: text("full_name").notNull(),
  phone: varchar("phone", { length: 20 }),
  email: varchar("email", { length: 255 }).notNull(),
  location: text("location"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

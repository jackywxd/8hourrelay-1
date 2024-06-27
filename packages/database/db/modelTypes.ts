import * as schema from "./schema";
import * as z from "zod";
import { SchemaRelations, SchemaWithRelations } from "./types";
import {
  insertEmailInvitationSchema,
  selectEmailInvitationSchema,
} from "./schema";
import Stripe from "stripe";

export type User = typeof schema.usersTable.$inferSelect; // return type when queried
export type NewUser = typeof schema.usersTable.$inferInsert; // insert type

export type Event = typeof schema.eventsTable.$inferSelect;
export type NewEvent = typeof schema.eventsTable.$inferInsert;

export type Race<T extends SchemaRelations<"racesTable"> = never> =
  & SchemaWithRelations<"racesTable", T>
  & {
    stripePrice: Stripe.Price;
  };
export type NewRace = typeof schema.racesTable.$inferInsert;

export type Team<T extends SchemaRelations<"teamsTable"> = never> =
  SchemaWithRelations<"teamsTable", T>;
export type NewTeam = typeof schema.teamsTable.$inferInsert;

export type RaceEntry<T extends SchemaRelations<"raceEntriesTable"> = never> =
  SchemaWithRelations<"raceEntriesTable", T>;
export type NewRaceEntry = typeof schema.raceEntriesTable.$inferInsert;

export type EmailInvitation = z.infer<typeof selectEmailInvitationSchema>;
export type NewEmailInvitation = z.infer<typeof insertEmailInvitationSchema>;

export type PromoCode = typeof schema.promoCodesTable.$inferSelect;
export type NewPromoCode = typeof schema.promoCodesTable.$inferInsert;

export type Session = typeof schema.sessionsTable.$inferSelect;
export type NewSession = typeof schema.sessionsTable.$inferInsert;

export type NewRaceEntryToTeam =
  typeof schema.raceEntriesToTeamsTable.$inferInsert;

export type NewMessage = typeof schema.messagesTable.$inferInsert;

export type Roster<
  T extends SchemaRelations<"raceEntriesToTeamsTable"> = never,
> = SchemaWithRelations<"raceEntriesToTeamsTable", T>;

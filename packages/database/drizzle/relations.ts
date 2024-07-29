import { relations } from "drizzle-orm/relations";
import { 8hourrelay_dev_teams, 8hourrelay_dev_emailInvitations, 8hourrelay_dev_users, 8hourrelay_dev_raceEntries, 8hourrelay_dev_paymentStatus, 8hourrelay_dev_stripeSessions, 8hourrelay_dev_coupons, 8hourrelay_dev_promoCodes, 8hourrelay_dev_race_entries_to_teams, 8hourrelay_dev_events, 8hourrelay_dev_races } from "./schema";

export const 8hourrelay_dev_emailInvitationsRelations = relations(8hourrelay_dev_emailInvitations, ({one}) => ({
	8hourrelay_dev_team: one(8hourrelay_dev_teams, {
		fields: [8hourrelay_dev_emailInvitations.teamId],
		references: [8hourrelay_dev_teams.id]
	}),
	8hourrelay_dev_user: one(8hourrelay_dev_users, {
		fields: [8hourrelay_dev_emailInvitations.userId],
		references: [8hourrelay_dev_users.id]
	}),
}));

export const 8hourrelay_dev_teamsRelations = relations(8hourrelay_dev_teams, ({one, many}) => ({
	8hourrelay_dev_emailInvitations: many(8hourrelay_dev_emailInvitations),
	8hourrelay_dev_paymentStatuses: many(8hourrelay_dev_paymentStatus),
	8hourrelay_dev_race_entries_to_teams: many(8hourrelay_dev_race_entries_to_teams),
	8hourrelay_dev_user_captainId: one(8hourrelay_dev_users, {
		fields: [8hourrelay_dev_teams.captainId],
		references: [8hourrelay_dev_users.id],
		relationName: "8hourrelay_dev_teams_captainId_8hourrelay_dev_users_id"
	}),
	8hourrelay_dev_race: one(8hourrelay_dev_races, {
		fields: [8hourrelay_dev_teams.raceId],
		references: [8hourrelay_dev_races.id]
	}),
	8hourrelay_dev_stripeSession: one(8hourrelay_dev_stripeSessions, {
		fields: [8hourrelay_dev_teams.sessionId],
		references: [8hourrelay_dev_stripeSessions.sessionId]
	}),
	8hourrelay_dev_user_userId: one(8hourrelay_dev_users, {
		fields: [8hourrelay_dev_teams.userId],
		references: [8hourrelay_dev_users.id],
		relationName: "8hourrelay_dev_teams_userId_8hourrelay_dev_users_id"
	}),
}));

export const 8hourrelay_dev_usersRelations = relations(8hourrelay_dev_users, ({many}) => ({
	8hourrelay_dev_emailInvitations: many(8hourrelay_dev_emailInvitations),
	8hourrelay_dev_paymentStatuses: many(8hourrelay_dev_paymentStatus),
	8hourrelay_dev_raceEntries: many(8hourrelay_dev_raceEntries),
	8hourrelay_dev_race_entries_to_teams: many(8hourrelay_dev_race_entries_to_teams),
	8hourrelay_dev_teams_captainId: many(8hourrelay_dev_teams, {
		relationName: "8hourrelay_dev_teams_captainId_8hourrelay_dev_users_id"
	}),
	8hourrelay_dev_teams_userId: many(8hourrelay_dev_teams, {
		relationName: "8hourrelay_dev_teams_userId_8hourrelay_dev_users_id"
	}),
}));

export const 8hourrelay_dev_paymentStatusRelations = relations(8hourrelay_dev_paymentStatus, ({one}) => ({
	8hourrelay_dev_raceEntry: one(8hourrelay_dev_raceEntries, {
		fields: [8hourrelay_dev_paymentStatus.raceEntryId],
		references: [8hourrelay_dev_raceEntries.id]
	}),
	8hourrelay_dev_stripeSession: one(8hourrelay_dev_stripeSessions, {
		fields: [8hourrelay_dev_paymentStatus.sessionId],
		references: [8hourrelay_dev_stripeSessions.sessionId]
	}),
	8hourrelay_dev_team: one(8hourrelay_dev_teams, {
		fields: [8hourrelay_dev_paymentStatus.teamId],
		references: [8hourrelay_dev_teams.id]
	}),
	8hourrelay_dev_user: one(8hourrelay_dev_users, {
		fields: [8hourrelay_dev_paymentStatus.userId],
		references: [8hourrelay_dev_users.id]
	}),
}));

export const 8hourrelay_dev_raceEntriesRelations = relations(8hourrelay_dev_raceEntries, ({one, many}) => ({
	8hourrelay_dev_paymentStatuses: many(8hourrelay_dev_paymentStatus),
	8hourrelay_dev_promoCode: one(8hourrelay_dev_promoCodes, {
		fields: [8hourrelay_dev_raceEntries.promoCodeId],
		references: [8hourrelay_dev_promoCodes.id]
	}),
	8hourrelay_dev_stripeSession: one(8hourrelay_dev_stripeSessions, {
		fields: [8hourrelay_dev_raceEntries.sessionId],
		references: [8hourrelay_dev_stripeSessions.sessionId]
	}),
	8hourrelay_dev_user: one(8hourrelay_dev_users, {
		fields: [8hourrelay_dev_raceEntries.userId],
		references: [8hourrelay_dev_users.id]
	}),
	8hourrelay_dev_race_entries_to_teams: many(8hourrelay_dev_race_entries_to_teams),
}));

export const 8hourrelay_dev_stripeSessionsRelations = relations(8hourrelay_dev_stripeSessions, ({many}) => ({
	8hourrelay_dev_paymentStatuses: many(8hourrelay_dev_paymentStatus),
	8hourrelay_dev_raceEntries: many(8hourrelay_dev_raceEntries),
	8hourrelay_dev_teams: many(8hourrelay_dev_teams),
}));

export const 8hourrelay_dev_promoCodesRelations = relations(8hourrelay_dev_promoCodes, ({one, many}) => ({
	8hourrelay_dev_coupon: one(8hourrelay_dev_coupons, {
		fields: [8hourrelay_dev_promoCodes.couponId],
		references: [8hourrelay_dev_coupons.id]
	}),
	8hourrelay_dev_raceEntries: many(8hourrelay_dev_raceEntries),
}));

export const 8hourrelay_dev_couponsRelations = relations(8hourrelay_dev_coupons, ({many}) => ({
	8hourrelay_dev_promoCodes: many(8hourrelay_dev_promoCodes),
}));

export const 8hourrelay_dev_race_entries_to_teamsRelations = relations(8hourrelay_dev_race_entries_to_teams, ({one}) => ({
	8hourrelay_dev_raceEntry: one(8hourrelay_dev_raceEntries, {
		fields: [8hourrelay_dev_race_entries_to_teams.raceEntryId],
		references: [8hourrelay_dev_raceEntries.id]
	}),
	8hourrelay_dev_team: one(8hourrelay_dev_teams, {
		fields: [8hourrelay_dev_race_entries_to_teams.teamId],
		references: [8hourrelay_dev_teams.id]
	}),
	8hourrelay_dev_user: one(8hourrelay_dev_users, {
		fields: [8hourrelay_dev_race_entries_to_teams.userId],
		references: [8hourrelay_dev_users.id]
	}),
}));

export const 8hourrelay_dev_racesRelations = relations(8hourrelay_dev_races, ({one, many}) => ({
	8hourrelay_dev_event: one(8hourrelay_dev_events, {
		fields: [8hourrelay_dev_races.eventId],
		references: [8hourrelay_dev_events.id]
	}),
	8hourrelay_dev_teams: many(8hourrelay_dev_teams),
}));

export const 8hourrelay_dev_eventsRelations = relations(8hourrelay_dev_events, ({many}) => ({
	8hourrelay_dev_races: many(8hourrelay_dev_races),
}));
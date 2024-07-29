import { pgTable, foreignKey, unique, pgEnum, serial, varchar, timestamp, integer, boolean, json, numeric, index, uuid } from "drizzle-orm/pg-core"
  import { sql } from "drizzle-orm"

export const aal_level = pgEnum("aal_level", ['aal1', 'aal2', 'aal3'])
export const code_challenge_method = pgEnum("code_challenge_method", ['s256', 'plain'])
export const factor_status = pgEnum("factor_status", ['unverified', 'verified'])
export const factor_type = pgEnum("factor_type", ['totp', 'webauthn'])
export const one_time_token_type = pgEnum("one_time_token_type", ['confirmation_token', 'reauthentication_token', 'recovery_token', 'email_change_token_new', 'email_change_token_current', 'phone_change_token'])
export const request_status = pgEnum("request_status", ['PENDING', 'SUCCESS', 'ERROR'])
export const key_status = pgEnum("key_status", ['default', 'valid', 'invalid', 'expired'])
export const key_type = pgEnum("key_type", ['aead-ietf', 'aead-det', 'hmacsha512', 'hmacsha256', 'auth', 'shorthash', 'generichash', 'kdf', 'secretbox', 'secretstream', 'stream_xchacha20'])
export const gender_type = pgEnum("gender_type", ['Male', 'Female'])
export const size_type = pgEnum("size_type", ['S', 'M', 'L', 'XL', '2XL', '3XL', '4XL', '2XS', 'XS'])
export const user_role = pgEnum("user_role", ['admin', 'captain', 'member'])
export const action = pgEnum("action", ['INSERT', 'UPDATE', 'DELETE', 'TRUNCATE', 'ERROR'])
export const equality_op = pgEnum("equality_op", ['eq', 'neq', 'lt', 'lte', 'gt', 'gte', 'in'])


export const 8hourrelay_dev_emailInvitations = pgTable("8hourrelay_dev_emailInvitations", {
	id: serial("id").primaryKey().notNull(),
	email: varchar("email", { length: 1024 }).notNull(),
	gender: gender_type("gender").notNull(),
	createdAt: timestamp("createdAt", { mode: 'string' }).defaultNow().notNull(),
	userId: integer("userId").references(() => 8hourrelay_dev_users.id),
	teamId: integer("teamId").references(() => 8hourrelay_dev_teams.id),
},
(table) => {
	return {
		8hourrelay_dev_emailInvitations_email_unique: unique("8hourrelay_dev_emailInvitations_email_unique").on(table.email),
	}
});

export const 8hourrelay_dev_events = pgTable("8hourrelay_dev_events", {
	id: serial("id").primaryKey().notNull(),
	name: varchar("name", { length: 256 }).notNull(),
	year: varchar("year", { length: 4 }).notNull(),
	location: varchar("location", { length: 1024 }).notNull(),
	time: varchar("time", { length: 256 }).notNull(),
	registerDeadline: varchar("registerDeadline", { length: 256 }).notNull(),
	description: varchar("description", { length: 2048 }),
	isActive: boolean("isActive").notNull(),
	createdAt: timestamp("createdAt", { mode: 'string' }).defaultNow().notNull(),
},
(table) => {
	return {
		8hourrelay_dev_events_year_unique: unique("8hourrelay_dev_events_year_unique").on(table.year),
	}
});

export const 8hourrelay_dev_messages = pgTable("8hourrelay_dev_messages", {
	id: serial("id").primaryKey().notNull(),
	email: varchar("email", { length: 1024 }).notNull(),
	name: varchar("name", { length: 256 }).notNull(),
	message: varchar("message", { length: 1024 }).notNull(),
	createdAt: timestamp("createdAt", { mode: 'string' }).defaultNow().notNull(),
	response: json("response"),
});

export const 8hourrelay_dev_paymentStatus = pgTable("8hourrelay_dev_paymentStatus", {
	id: serial("id").primaryKey().notNull(),
	sessionId: varchar("sessionId", { length: 256 }).references(() => 8hourrelay_dev_stripeSessions.sessionId),
	userId: integer("userId").notNull().references(() => 8hourrelay_dev_users.id),
	teamId: integer("teamId").references(() => 8hourrelay_dev_teams.id, { onDelete: "cascade" } ),
	raceEntryId: integer("raceEntryId").references(() => 8hourrelay_dev_raceEntries.id, { onDelete: "cascade" } ),
});

export const 8hourrelay_dev_promoCodes = pgTable("8hourrelay_dev_promoCodes", {
	id: serial("id").primaryKey().notNull(),
	code: varchar("code", { length: 256 }).notNull(),
	discount: integer("discount").notNull(),
	expiresAt: timestamp("expiresAt", { mode: 'string' }).notNull(),
	maxUsage: integer("maxUsage").notNull(),
	isActive: boolean("isActive").default(true).notNull(),
	promoCodeId: varchar("promoCodeId", { length: 256 }).notNull(),
	createdAt: timestamp("createdAt", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updatedAt", { mode: 'string' }).defaultNow().notNull(),
	couponId: varchar("couponId", { length: 256 }).references(() => 8hourrelay_dev_coupons.id),
},
(table) => {
	return {
		8hourrelay_dev_promoCodes_code_unique: unique("8hourrelay_dev_promoCodes_code_unique").on(table.code),
	}
});

export const 8hourrelay_dev_raceEntries = pgTable("8hourrelay_dev_raceEntries", {
	id: serial("id").primaryKey().notNull(),
	firstName: varchar("firstName", { length: 256 }).notNull(),
	lastName: varchar("lastName", { length: 256 }).notNull(),
	preferName: varchar("preferName", { length: 256 }),
	birthYear: varchar("birthYear", { length: 4 }).notNull(),
	personalBest: varchar("personalBest", { length: 256 }),
	gender: gender_type("gender").notNull(),
	email: varchar("email", { length: 1024 }).notNull(),
	phone: varchar("phone", { length: 15 }).notNull(),
	year: varchar("year", { length: 4 }).notNull(),
	wechatId: varchar("wechatId", { length: 256 }),
	isActive: boolean("isActive").default(true).notNull(),
	isForOther: boolean("isForOther").default(false).notNull(),
	size: size_type("size").notNull(),
	emergencyName: varchar("emergencyName", { length: 256 }).notNull(),
	emergencyPhone: varchar("emergencyPhone", { length: 15 }).notNull(),
	medicalInfo: varchar("medicalInfo", { length: 2048 }),
	teamPassword: varchar("teamPassword", { length: 256 }),
	emailConsent: boolean("emailConsent").default(false).notNull(),
	smsOptIn: boolean("smsOptIn").default(false).notNull(),
	accepted: boolean("accepted").default(false).notNull(),
	createdAt: timestamp("createdAt", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updatedAt", { mode: 'string' }).defaultNow().notNull(),
	userId: integer("userId").notNull().references(() => 8hourrelay_dev_users.id),
	sessionId: varchar("sessionId", { length: 256 }).notNull().references(() => 8hourrelay_dev_stripeSessions.sessionId),
	promoCodeId: integer("promoCodeId").references(() => 8hourrelay_dev_promoCodes.id),
});

export const 8hourrelay_dev_race_entries_to_teams = pgTable("8hourrelay_dev_race_entries_to_teams", {
	id: serial("id").primaryKey().notNull(),
	teamId: integer("teamId").notNull().references(() => 8hourrelay_dev_teams.id, { onDelete: "cascade" } ),
	raceEntryId: integer("raceEntryId").notNull().references(() => 8hourrelay_dev_raceEntries.id),
	userId: integer("userId").notNull().references(() => 8hourrelay_dev_users.id),
	bib: varchar("bib", { length: 256 }),
	raceOrder: integer("raceOrder"),
	raceDuration: integer("raceDuration"),
	raceActualDistance: numeric("raceActualDistance"),
	raceAdjustedDistance: numeric("raceAdjustedDistance"),
	raceCoefficient: numeric("raceCoefficient"),
	raceStartTime: varchar("raceStartTime"),
	raceEndTime: varchar("raceEndTime"),
});

export const 8hourrelay_dev_races = pgTable("8hourrelay_dev_races", {
	id: serial("id").primaryKey().notNull(),
	year: varchar("year", { length: 4 }).notNull(),
	name: varchar("name", { length: 256 }).notNull(),
	isCompetitive: boolean("isCompetitive").notNull(),
	description: varchar("description", { length: 2048 }),
	entryFee: integer("entryFee").notNull(),
	lowerAge: integer("lowerAge"),
	upperAge: integer("upperAge"),
	maxTeamSize: integer("maxTeamSize"),
	minFemale: integer("minFemale"),
	lookupKey: varchar("lookupKey", { length: 256 }),
	stripePrice: json("stripePrice"),
	eventId: integer("eventId").references(() => 8hourrelay_dev_events.id),
},
(table) => {
	return {
		dev_unique_year_name: unique("dev_unique_year_name").on(table.year, table.name),
	}
});

export const 8hourrelay_dev_stripeSessions = pgTable("8hourrelay_dev_stripeSessions", {
	sessionId: varchar("sessionId", { length: 256 }).primaryKey().notNull(),
	priceId: varchar("priceId", { length: 256 }).notNull(),
	productId: varchar("productId", { length: 256 }).notNull(),
	paymentIntentId: varchar("paymentIntentId"),
	status: varchar("status", { length: 256 }).notNull(),
	paymentStatus: varchar("paymentStatus", { length: 256 }).notNull(),
	payload: json("payload"),
	createdAt: timestamp("createdAt", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updatedAt", { mode: 'string' }).defaultNow().notNull(),
	expiresAt: timestamp("expiresAt", { mode: 'string' }).notNull(),
	amount: integer("amount").notNull(),
	currency: varchar("currency", { length: 10 }).notNull(),
	receiptNumber: varchar("receiptNumber", { length: 256 }),
	receiptUrl: varchar("receiptUrl", { length: 1024 }),
	quantity: integer("quantity").default(1).notNull(),
});

export const 8hourrelay_dev_teams = pgTable("8hourrelay_dev_teams", {
	id: serial("id").primaryKey().notNull(),
	year: varchar("year", { length: 4 }).notNull(),
	name: varchar("name", { length: 256 }).notNull(),
	createdAt: timestamp("createdAt", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updatedAt", { mode: 'string' }).defaultNow().notNull(),
	slogan: varchar("slogan", { length: 1024 }),
	photoUrl: varchar("photoUrl", { length: 1024 }),
	password: varchar("password", { length: 256 }),
	isOpen: boolean("isOpen").default(true),
	state: varchar("state", { length: 10 }).default('PENDING'::character varying),
	captainId: integer("captainId").references(() => 8hourrelay_dev_users.id),
	userId: integer("userId").notNull().references(() => 8hourrelay_dev_users.id),
	raceId: integer("raceId").notNull().references(() => 8hourrelay_dev_races.id),
	sessionId: varchar("sessionId", { length: 256 }).references(() => 8hourrelay_dev_stripeSessions.sessionId),
},
(table) => {
	return {
		name_idx: index("name_index").using("btree", table.name),
		dev_unique_year_team_name: unique("dev_unique_year_team_name").on(table.year, table.name),
		dev_unique_year_user: unique("dev_unique_year_user").on(table.year, table.userId),
	}
});

export const 8hourrelay_dev_users = pgTable("8hourrelay_dev_users", {
	id: serial("id").primaryKey().notNull(),
	email: varchar("email", { length: 1024 }),
	uid: uuid("uid").notNull(),
	createdAt: timestamp("createdAt", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updatedAt", { mode: 'string' }).defaultNow().notNull(),
	firstName: varchar("firstName", { length: 256 }),
	lastName: varchar("lastName", { length: 256 }),
	preferName: varchar("preferName", { length: 256 }),
	gender: varchar("gender", { length: 10 }),
	wechatId: varchar("wechatId", { length: 256 }),
	birthYear: varchar("birthYear", { length: 16 }),
	personalBest: varchar("personalBest", { length: 256 }),
	avatarUrl: varchar("avatarUrl", { length: 1024 }),
	customerId: varchar("customerId", { length: 256 }),
	phone: varchar("phone", { length: 16 }),
	address: varchar("address", { length: 1024 }),
},
(table) => {
	return {
		email_idx: index("email_index").using("btree", table.email),
		uid_idx: index("uid_index").using("btree", table.uid),
		8hourrelay_dev_users_uid_unique: unique("8hourrelay_dev_users_uid_unique").on(table.uid),
	}
});

export const 8hourrelay_dev_coupons = pgTable("8hourrelay_dev_coupons", {
	id: varchar("id").primaryKey().notNull(),
	name: varchar("name", { length: 256 }).notNull(),
	amountOff: integer("amountOff"),
	currency: varchar("currency", { length: 10 }),
	percentOff: integer("percentOff"),
	valid: boolean("valid").default(true).notNull(),
	timesRedeemed: integer("timesRedeemed").default(0).notNull(),
	duration: varchar("duration", { length: 256 }),
	createdAt: timestamp("createdAt", { mode: 'string' }).defaultNow().notNull(),
});
// Example model schema from the Drizzle docs
// https://orm.drizzle.team/docs/sql-schema-declaration

import { SQL, relations, sql } from 'drizzle-orm';
import {
  AnyPgColumn,
  boolean,
  index,
  integer,
  json,
  numeric,
  pgEnum,
  pgTableCreator,
  serial,
  timestamp,
  unique,
  uuid,
  varchar,
} from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';
import { genderEnum, roleEnum, sizeEnum } from './modelTypes';

// custom lower function
export function lower(col: AnyPgColumn): SQL {
  return sql`lower(${col})`;
}

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
const stage = process.env.STAGE || 'dev';

export const createTable = pgTableCreator(
  (name) => `8hourrelay_${stage}_${name}`,
);

///////////////////////////// ENUMS
export const UserRoleEnum = pgEnum('user_role', roleEnum);

export const GenderTypeEnum = pgEnum('gender_type', genderEnum);

export const SizeTypeEnum = pgEnum('size_type', sizeEnum);

///////////////////////////// TABLES
export const eventsTable = createTable('events', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 256 }).notNull(),
  year: varchar('year', { length: 4 }).notNull().unique(),
  location: varchar('location', { length: 1024 }).notNull(), // white rock
  time: varchar('time', { length: 256 }).notNull(), //sep 7, 2024
  registerDeadline: varchar('registerDeadline', { length: 256 }).notNull(),
  description: varchar('description', { length: 2048 }),
  isActive: boolean('isActive').notNull(),
  createdAt: timestamp('createdAt')
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
});

export const racesTable = createTable(
  'races',
  {
    id: serial('id').primaryKey(),
    year: varchar('year', { length: 4 }).notNull(),
    name: varchar('name', { length: 256 }).notNull(), // race name: adult or kids
    isCompetitive: boolean('isCompetitive').notNull(), // is this race will calculate result
    description: varchar('description', { length: 2048 }),
    entryFee: integer('entryFee').notNull(),
    lowerAge: integer('lowerAge'),
    upperAge: integer('upperAge'),
    maxTeamSize: integer('maxTeamSize'),
    minFemale: integer('minFemale'),
    lookupKey: varchar('lookupKey', { length: 256 }), // stripe price lookup_key
    stripePrice: json('stripePrice'),
    eventId: integer('eventId').references(() => eventsTable.id),
  },
  (table) => ({
    uniqueYearName: unique(`${stage}_unique_year_name`).on(
      table.year,
      table.name,
    ),
  }),
);

export const teamsTable = createTable(
  'teams',
  {
    id: serial('id').primaryKey(),
    year: varchar('year', { length: 4 }).notNull(),
    name: varchar('name', { length: 256 }).notNull(),
    createdAt: timestamp('createdAt')
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp('updatedAt')
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    slogan: varchar('slogan', { length: 1024 }),
    photoUrl: varchar('photoUrl', { length: 1024 }),
    password: varchar('password', { length: 256 }),
    isOpen: boolean('isOpen').default(true),
    state: varchar('state', { length: 10 }).default('PENDING'),

    // captain of the team
    captainId: integer('captainId').references(() => usersTable.id),

    // owner of the team
    userId: integer('userId')
      .notNull()
      .references(() => usersTable.id),
    raceId: integer('raceId')
      .notNull()
      .references(() => racesTable.id),

    // payment session Id, it cloud be null when payment is not needed
    sessionId: varchar('sessionId', { length: 256 }).references(
      () => sessionsTable.sessionId,
    ),
  },
  (table) => ({
    teamNameIndex: index('name_index').on(table.name),
    // each yearn the team name should be unique
    uniqueYearTeamName: unique(`${stage}_unique_year_team_name`).on(
      table.year,
      table.name,
    ),
    // each year and user can only have one team
    uniqueYearUser: unique(`${stage}_unique_year_user`).on(
      table.year,
      table.userId,
    ),
  }),
);

export const raceEntriesToTeamsTable = createTable('race_entries_to_teams', {
  id: serial('id').primaryKey(),
  teamId: integer('teamId')
    .notNull()
    .references(() => teamsTable.id, { onDelete: 'cascade' }),
  raceEntryId: integer('raceEntryId')
    .notNull()
    .references(() => raceEntriesTable.id),
  userId: integer('userId')
    .notNull()
    .references(() => usersTable.id),
  bib: varchar('bib', { length: 256 }),
  raceOrder: integer('raceOrder'), // the sequence in the team
  raceDuration: integer('raceDuration'), // run period in minutes
  raceActualDistance: numeric('raceActualDistance'), // run distance in meters this is the result
  raceAdjustedDistance: numeric('raceAdjustedDistance'), // run distance in meters this is the result
  raceCoefficient: numeric('raceCoefficient'), // coefficient based on the age
  raceStartTime: varchar('raceStartTime'),
  raceEndTime: varchar('raceEndTime'),
});

export const usersTable = createTable(
  'users',
  {
    id: serial('id').primaryKey(),
    email: varchar('email', { length: 1024 }),
    uid: uuid('uid').notNull().unique(),
    createdAt: timestamp('createdAt')
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp('updatedAt')
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    firstName: varchar('firstName', { length: 256 }),
    lastName: varchar('lastName', { length: 256 }),
    preferName: varchar('preferName', { length: 256 }),
    gender: varchar('gender', { length: 10 }),
    wechatId: varchar('wechatId', { length: 256 }),
    birthYear: varchar('birthYear', { length: 16 }),
    personalBest: varchar('personalBest', { length: 256 }),
    avatarUrl: varchar('avatarUrl', { length: 1024 }),
    customerId: varchar('customerId', { length: 256 }), // stripe customer id
    phone: varchar('phone', { length: 16 }),
    address: varchar('address', { length: 1024 }),
  },
  (table) => {
    return {
      uidIndex: index('uid_index').on(table.uid),
      emailIndex: index('email_index').on(table.email),
    };
  },
);

export const emailInvitationsTable = createTable('emailInvitations', {
  id: serial('id').primaryKey(),
  email: varchar('email', { length: 1024 }).notNull().unique(),
  gender: GenderTypeEnum('gender').notNull(),
  createdAt: timestamp('createdAt')
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  // user who send the invitation
  userId: integer('userId').references(() => usersTable.id),
  teamId: integer('teamId').references(() => teamsTable.id),
});

export const raceEntriesTable = createTable('raceEntries', {
  id: serial('id').primaryKey(),
  firstName: varchar('firstName', { length: 256 }).notNull(),
  lastName: varchar('lastName', { length: 256 }).notNull(),
  preferName: varchar('preferName', { length: 256 }),
  birthYear: varchar('birthYear', { length: 4 }).notNull(),
  personalBest: varchar('personalBest', { length: 256 }),
  gender: GenderTypeEnum('gender').notNull(),
  email: varchar('email', { length: 1024 }).notNull(),
  phone: varchar('phone', { length: 15 }).notNull(),
  year: varchar('year', { length: 4 }).notNull(),
  wechatId: varchar('wechatId', { length: 256 }),
  isActive: boolean('isActive').default(true).notNull(),
  isForOther: boolean('isForOther').default(false).notNull(),
  size: SizeTypeEnum('size').notNull(),
  emergencyName: varchar('emergencyName', { length: 256 }).notNull(),
  emergencyPhone: varchar('emergencyPhone', { length: 15 }).notNull(),
  medicalInfo: varchar('medicalInfo', { length: 2048 }),
  teamPassword: varchar('teamPassword', { length: 256 }),
  emailConsent: boolean('emailConsent').default(false).notNull(),
  smsOptIn: boolean('smsOptIn').default(false).notNull(),
  accepted: boolean('accepted').default(false).notNull(),
  createdAt: timestamp('createdAt')
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
  updatedAt: timestamp('updatedAt')
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),

  userId: integer('userId')
    .notNull()
    .references(() => usersTable.id),
  sessionId: varchar('sessionId', { length: 256 })
    .notNull()
    .references(() => sessionsTable.sessionId),

  // it could be null when there is no promo code
  promoCodeId: integer('promoCodeId').references(() => promoCodesTable.id),
});

export const sessionsTable = createTable('stripeSessions', {
  sessionId: varchar('sessionId', { length: 256 }).primaryKey(),
  priceId: varchar('priceId', { length: 256 }).notNull(), // stripe price id
  quantity: integer('quantity').notNull().default(1), // quantity of priceId
  productId: varchar('productId', { length: 256 }).notNull(), // stripe product id
  paymentIntentId: varchar('paymentIntentId'), // stripe payment intent id, it could be null when payment is not completed
  status: varchar('status', { length: 256 }).notNull(), // stripe session status
  paymentStatus: varchar('paymentStatus', { length: 256 }).notNull(), // stripe payment status
  payload: json('payload'), // stripe checkout session object
  createdAt: timestamp('createdAt')
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
  updatedAt: timestamp('updatedAt')
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
  expiresAt: timestamp('expiresAt').notNull(),
  amount: integer('amount').notNull(),
  currency: varchar('currency', { length: 10 }).notNull(),
  receiptNumber: varchar('receiptNumber', { length: 256 }),
  receiptUrl: varchar('receiptUrl', { length: 1024 }),
});

export const paymentStatusTable = createTable('paymentStatus', {
  id: serial('id').primaryKey(),
  sessionId: varchar('sessionId', { length: 256 }).references(
    () => sessionsTable.sessionId,
  ),
  userId: integer('userId')
    .notNull()
    .references(() => usersTable.id),

  teamId: integer('teamId').references(() => teamsTable.id, {
    onDelete: 'cascade',
  }),
  raceEntryId: integer('raceEntryId').references(() => raceEntriesTable.id, {
    onDelete: 'cascade',
  }),
});

export const promoCodesTable = createTable('promoCodes', {
  id: serial('id').primaryKey(),
  code: varchar('code', { length: 256 }).notNull().unique(),
  discount: integer('discount').notNull(),
  expiresAt: timestamp('expiresAt').notNull(),
  maxUsage: integer('maxUsage').notNull(),
  isActive: boolean('isActive').notNull().default(true), // whether this promo code is active
  apiId: varchar('apiId', { length: 256 }), // stripe coupon promo code api id
});

export const messagesTable = createTable('messages', {
  id: serial('id').primaryKey(),
  email: varchar('email', { length: 1024 }).notNull(),
  name: varchar('name', { length: 256 }).notNull(),
  message: varchar('message', { length: 1024 }).notNull(),
  response: json('response'),
  createdAt: timestamp('createdAt')
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
});

///////////////////////////// RELATIONS /////////////////////////////

export const eventsRelations = relations(eventsTable, ({ many }) => ({
  races: many(racesTable),
}));

export const racesRelations = relations(racesTable, ({ one, many }) => ({
  event: one(eventsTable, {
    fields: [racesTable.eventId],
    references: [eventsTable.id],
  }),
  teams: many(teamsTable),
}));

export const teamsRelations = relations(teamsTable, ({ one, many }) => ({
  race: one(racesTable, {
    fields: [teamsTable.raceId],
    references: [racesTable.id],
  }),
  user: one(usersTable, {
    fields: [teamsTable.userId],
    references: [usersTable.id],
    relationName: 'owner',
  }),
  session: one(sessionsTable, {
    fields: [teamsTable.sessionId],
    references: [sessionsTable.sessionId],
  }),
  captain: one(usersTable, {
    fields: [teamsTable.captainId],
    references: [usersTable.id],
    relationName: 'captain',
  }),
  raceEntriesToTeams: many(raceEntriesToTeamsTable),
  payments: many(paymentStatusTable),
}));

export const usersRelations = relations(usersTable, ({ many }) => ({
  raceEntries: many(raceEntriesTable),
  emailInvitations: many(emailInvitationsTable),
  raceEntriesToTeams: many(raceEntriesToTeamsTable),
  teams: many(teamsTable, { relationName: 'owner' }),
  captains: many(teamsTable, { relationName: 'captain' }),
  payments: many(paymentStatusTable),
}));

export const emailInvitationsRelations = relations(
  emailInvitationsTable,
  ({ one }) => ({
    user: one(usersTable, {
      fields: [emailInvitationsTable.userId],
      references: [usersTable.id],
    }),
    team: one(teamsTable, {
      fields: [emailInvitationsTable.teamId],
      references: [teamsTable.id],
    }),
  }),
);

export const raceEntriesRelations = relations(
  raceEntriesTable,
  ({ one, many }) => ({
    user: one(usersTable, {
      fields: [raceEntriesTable.userId],
      references: [usersTable.id],
    }),
    session: one(sessionsTable, {
      fields: [raceEntriesTable.sessionId],
      references: [sessionsTable.sessionId],
    }),
    promoCode: one(promoCodesTable, {
      fields: [raceEntriesTable.promoCodeId],
      references: [promoCodesTable.id],
    }),
    raceEntriesToTeams: many(raceEntriesToTeamsTable),
    payments: many(paymentStatusTable),
  }),
);

export const raceEntriesToTeamsRelations = relations(
  raceEntriesToTeamsTable,
  ({ one }) => ({
    user: one(usersTable, {
      fields: [raceEntriesToTeamsTable.userId],
      references: [usersTable.id],
    }),
    team: one(teamsTable, {
      fields: [raceEntriesToTeamsTable.teamId],
      references: [teamsTable.id],
    }),
    raceEntry: one(raceEntriesTable, {
      fields: [raceEntriesToTeamsTable.raceEntryId],
      references: [raceEntriesTable.id],
    }),
  }),
);

export const sessionsRelations = relations(sessionsTable, ({ one, many }) => ({
  payments: many(paymentStatusTable),
}));

export const paymentStatusRelations = relations(
  paymentStatusTable,
  ({ one }) => ({
    session: one(sessionsTable, {
      fields: [paymentStatusTable.sessionId],
      references: [sessionsTable.sessionId],
    }),
    team: one(teamsTable, {
      fields: [paymentStatusTable.teamId],
      references: [teamsTable.id],
    }),
    user: one(usersTable, {
      fields: [paymentStatusTable.userId],
      references: [usersTable.id],
    }),
    raceEntry: one(raceEntriesTable, {
      fields: [paymentStatusTable.raceEntryId],
      references: [raceEntriesTable.id],
    }),
  }),
);

//////////////////////////// ZOD SCHEMAS /////////////////////////////

export const insertEventSchema = createInsertSchema(eventsTable);
export const selectEventSchema = createSelectSchema(eventsTable);

export const insertRaceSchema = createInsertSchema(racesTable);
export const selectRaceSchema = createSelectSchema(racesTable);

export const insertTeamSchema = createInsertSchema(teamsTable, {
  name: z.string().min(1).max(256),
  password: z.string().min(1).max(256),
});

export const updateTeamSchema = createInsertSchema(teamsTable, {
  name: (schema) => schema.name.optional(),
  year: (schema) => schema.year.optional(),
  password: (schema) => schema.password.optional(),
  captainId: (schema) => schema.captainId.optional(),
  userId: (schema) => schema.userId.optional(),
  raceId: (schema) => schema.raceId.optional(),
});
export const selectTeamSchema = createSelectSchema(teamsTable);

export const insertUserSchema = createInsertSchema(usersTable, {
  email: (schema) => schema.email.email(),
});
export const selectUserSchema = createSelectSchema(usersTable);
export const updateUserSchema = createInsertSchema(usersTable, {
  email: (schema) => schema.email.email().optional(),
  uid: (schema) => schema.uid.optional(),
});

export const insertRaceEntrySchema = createInsertSchema(raceEntriesTable, {
  email: (schema) => schema.email.email(),
});

export const insertRaceEntryToTeamsSchema = createInsertSchema(
  raceEntriesToTeamsTable,
);

export const updateRaceEntryToTeamsSchema = createInsertSchema(
  raceEntriesToTeamsTable,
  {
    userId: (schema) => schema.userId.optional(),
    teamId: (schema) => schema.teamId.optional(),
    raceEntryId: (schema) => schema.raceEntryId.optional(),
  },
);

export const updateRaceEntrySchema = createInsertSchema(raceEntriesTable, {
  email: (schema) => schema.email.email().optional(),
  firstName: (schema) => schema.firstName.optional(),
  lastName: (schema) => schema.lastName.optional(),
  phone: (schema) => schema.phone.optional(),
  birthYear: (schema) => schema.birthYear.optional(),
  gender: (schema) => schema.gender.optional(),
  isActive: (schema) => schema.isActive.optional(),
  isForOther: (schema) => schema.isForOther.optional(),
  size: (schema) => schema.size.optional(),
  emergencyName: (schema) => schema.emergencyName.optional(),
  emergencyPhone: (schema) => schema.emergencyPhone.optional(),
  emailConsent: (schema) => schema.emailConsent.optional(),
  smsOptIn: (schema) => schema.smsOptIn.optional(),
  accepted: (schema) => schema.accepted.optional(),
  year: (schema) => schema.year.optional(),
  userId: (schema) => schema.userId.optional(),
  sessionId: (schema) => schema.sessionId.optional(),
});

export const selectRaceEntrySchema = createSelectSchema(raceEntriesTable);

export const insertEmailInvitationSchema = createInsertSchema(
  emailInvitationsTable,
  {
    email: (schema) => schema.email.email(),
  },
);

export const selectEmailInvitationSchema = createSelectSchema(
  emailInvitationsTable,
);
export const insertEmailInvitationUpdateSchema = createInsertSchema(
  emailInvitationsTable,
);

export const insertPromoCodeSchema = createInsertSchema(promoCodesTable);
export const selectPromoCodeSchema = createSelectSchema(promoCodesTable);

export const insertSessionSchema = createInsertSchema(sessionsTable);
export const selectSessionSchema = createSelectSchema(sessionsTable);

export const insertMessageSchema = createInsertSchema(messagesTable, {
  message: z.string().min(1).max(256),
  email: (schema) => schema.email.email(),
});

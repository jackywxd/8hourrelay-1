import 'server-only';

import { and, asc, count, eq, sql } from 'drizzle-orm';

import {
  db,
  GenderType,
  insertRaceEntrySchema,
  insertRaceEntryToTeamsSchema,
  insertSessionSchema,
  lower,
  NewRaceEntry,
  NewSession,
  paymentStatusTable,
  raceEntriesTable,
  raceEntriesToTeamsTable,
  Roster,
  sessionsTable,
  updateRaceEntrySchema,
  updateRaceEntryToTeamsSchema,
} from '../db';
import { getTotalTeamsMembersById } from './team-api';

export const createPaidRaceEntry = async (
  data: NewRaceEntry,
  session: NewSession,
  teamId: number,
) => {
  const newRaceEntryId = await db.transaction(async (tx) => {
    // must write the session first
    const validatedSessionData = insertSessionSchema.parse(session);
    const newSession = await tx
      .insert(sessionsTable)
      .values(validatedSessionData)
      .returning({ id: sessionsTable.sessionId });

    // race entry will reference the session table
    const validatedData = insertRaceEntrySchema.parse({
      ...data,
      sessionId: newSession[0].id,
    });
    const result = await tx
      .insert(raceEntriesTable)
      .values(validatedData)
      .returning({ id: raceEntriesTable.id });

    const totalTeamMembers = await db
      .select({ count: count() })
      .from(raceEntriesToTeamsTable)
      .where(eq(raceEntriesToTeamsTable.teamId, teamId));
    const validatedRaceEntryToTeamsData = insertRaceEntryToTeamsSchema.parse({
      raceEntryId: result[0].id,
      teamId: teamId,
      userId: data.userId,
      raceDuration: 20, // default to 20 minutes
      raceOrder: totalTeamMembers[0]?.count
        ? +totalTeamMembers[0].count + 1
        : 1,
    });

    await tx
      .insert(raceEntriesToTeamsTable)
      .values(validatedRaceEntryToTeamsData);

    await tx.insert(paymentStatusTable).values({
      sessionId: data.sessionId,
      userId: data.userId,
      raceEntryId: result[0].id,
    });
    return result[0];
  });

  return newRaceEntryId;
};

// Open category race no need to pay
// sessionId is set to team's session Id who was paid by the user who created team
export const createOpenRaceEntry = async (
  data: NewRaceEntry,
  teamId: number,
) => {
  const newRaceEntryId = await db.transaction(async (tx) => {
    const validatedData = insertRaceEntrySchema.parse(data);
    const result = await tx
      .insert(raceEntriesTable)
      .values(validatedData)
      .returning({ id: raceEntriesTable.id });

    const totalTeamMembers = await db
      .select({ count: count() })
      .from(raceEntriesToTeamsTable)
      .where(eq(raceEntriesToTeamsTable.teamId, teamId));
    const validatedRaceEntryToTeamsData = insertRaceEntryToTeamsSchema.parse({
      raceEntryId: result[0].id,
      teamId: teamId,
      userId: data.userId,
      raceDuration: 40, // default to 20 minutes
      raceOrder: totalTeamMembers[0]?.count
        ? +totalTeamMembers[0].count + 1
        : 1,
    });

    await tx
      .insert(raceEntriesToTeamsTable)
      .values(validatedRaceEntryToTeamsData);

    await tx.insert(paymentStatusTable).values({
      sessionId: data.sessionId,
      userId: data.userId,
      raceEntryId: result[0].id,
    });
    return result[0];
  });

  return newRaceEntryId;
};

// get all race entries and related data for the user
export const getUserAllRaceEntries = async (id: number) => {
  const result = await db.query.raceEntriesTable.findMany({
    where: eq(raceEntriesTable.userId, id),
    with: {
      user: true,
      raceEntriesToTeams: {
        with: {
          team: {
            with: {
              race: true,
            },
          },
        },
      },
      session: true,
    },
    orderBy: [asc(raceEntriesTable.createdAt)],
  });
  console.log(`all race entries result for user ${id}`, result);
  const data = result.map((entry) => {
    return {
      ...entry,
      team: entry?.raceEntriesToTeams[0]?.team,
      race: entry?.raceEntriesToTeams[0]?.team?.race,
    };
  });
  return data;
};

export type UserAllRaceEntries = Awaited<
  ReturnType<typeof getUserAllRaceEntries>
>;

export const updateRaceEntryOrder = async (
  rosters: Pick<Roster, 'id' | 'raceOrder'>[],
) => {
  await db.transaction(async (tx) => {
    for (const { id, raceOrder: order } of rosters) {
      await tx
        .update(raceEntriesToTeamsTable)
        .set({ raceOrder: order })
        .where(eq(raceEntriesToTeamsTable.id, id));
    }
  });
};

export const updateRaceEntry = async (
  id: number,
  data: Partial<NewRaceEntry>,
) => {
  const validatedData = updateRaceEntrySchema.parse(data);
  const result = await db
    .update(raceEntriesTable)
    .set(validatedData)
    .where(eq(raceEntriesTable.id, id));
  return result;
};

export const transferRosterToNewTeam = async (
  id: number, // roster id to update
  fromTeam: number, // team ID of the current team
  toTeam: number, // team ID of the new team
) => {
  await db.transaction(async (tx) => {
    // now we can transfer, update the team Id in the roster to the new team
    // increment the race order in the new team
    const count = await getTotalTeamsMembersById(toTeam);
    const validatedData = updateRaceEntryToTeamsSchema.parse({
      teamId: toTeam,
      raceOrder: count ? count + 1 : 1,
      raceDuration: 20,
    });
    await tx
      .update(raceEntriesToTeamsTable)
      .set(validatedData)
      .where(eq(raceEntriesToTeamsTable.id, id));

    // we need to commit the transaction to update the database first;
    // or the next select query will return the old roster
    await tx.execute(sql`commit`);
    // after transferred we need to reorder the current roster after the member is transferred
    const currentRoster = await getRaceEntryRosterByTeamId(fromTeam); // already sorted by race order
    let index = 1;
    for (const roster of currentRoster) {
      await tx
        .update(raceEntriesToTeamsTable)
        .set({ raceOrder: index })
        .where(eq(raceEntriesToTeamsTable.id, roster.id));
      // increment the index
      index++;
    }
  });
};

export const updateRaceEntryRoster = async (
  id: number,
  data: Partial<Roster>,
) => {
  const validatedData = updateRaceEntryToTeamsSchema.parse(data);
  const result = await db
    .update(raceEntriesToTeamsTable)
    .set(validatedData)
    .where(eq(raceEntriesToTeamsTable.id, id));
  return result;
};

export const getRaceEntryRosterById = async (id: number) => {
  const result = await db.query.raceEntriesToTeamsTable.findFirst({
    where: eq(raceEntriesToTeamsTable.id, id),
    with: {
      raceEntry: true,
      team: true,
    },
  });
  return result;
};

export type RaceEntryRoster = Awaited<
  ReturnType<typeof getRaceEntryRosterById>
>;

export const getRaceEntryRosterByTeamId = async (id: number) => {
  const result = await db.query.raceEntriesToTeamsTable.findMany({
    where: eq(raceEntriesToTeamsTable.teamId, id),
    orderBy: [asc(raceEntriesToTeamsTable.raceOrder)],
  });
  return result;
};

export const getRaceEntryById = async (id: number, userId: number) => {
  const result = await db.query.raceEntriesTable.findFirst({
    where: and(
      eq(raceEntriesTable.id, id),
      eq(raceEntriesTable.userId, userId),
    ),
    with: {
      raceEntriesToTeams: {
        with: {
          team: true,
        },
      },
    },
  });
  return { ...result, team: result?.raceEntriesToTeams[0]?.team };
};

export type RaceEntryById = Awaited<ReturnType<typeof getRaceEntryById>>;

export const findDuplicateRaceEntry = async (data: {
  firstName: string;
  lastName: string;
  birthYear: string;
  gender: GenderType;
  year?: string;
}) => {
  const { firstName, lastName, birthYear, gender } = data;
  const year = data?.year ? data?.year : new Date().getFullYear().toString();
  const result = await db
    .select()
    .from(raceEntriesTable)
    .where(
      and(
        eq(lower(raceEntriesTable.firstName), firstName.toLowerCase()),
        eq(lower(raceEntriesTable.lastName), lastName.toLowerCase()),
        eq(raceEntriesTable.isActive, true),
        eq(raceEntriesTable.birthYear, birthYear),
        eq(raceEntriesTable.gender, gender),
        eq(raceEntriesTable.year, year),
      ),
    );
  return result.length > 0;
};

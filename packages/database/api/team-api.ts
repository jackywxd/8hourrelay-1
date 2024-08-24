import 'server-only';

import { and, count, eq } from 'drizzle-orm';

import {
  db,
  insertSessionSchema,
  insertTeamSchema,
  NewSession,
  NewTeam,
  paymentStatusTable,
  raceEntriesTable,
  raceEntriesToTeamsTable,
  racesTable,
  selectRaceSchema,
  selectTeamSchema,
  sessionsTable,
  Team,
  teamsTable,
  updateTeamSchema,
} from '../db';

export const createOpenTeam = async (data: NewTeam, session: NewSession) => {
  const newTeamId = await db.transaction(async (tx) => {
    const validatedSessionData = insertSessionSchema.parse(session);
    const sessionData = await tx
      .insert(sessionsTable)
      .values(validatedSessionData)
      .returning({ id: sessionsTable.sessionId });

    const validatedData = insertTeamSchema.parse({
      ...data,
      sessionId: sessionData[0].id,
    });
    const result = await tx
      .insert(teamsTable)
      .values(validatedData)
      .returning({ id: teamsTable.id });

    await tx.insert(paymentStatusTable).values({
      sessionId: session.sessionId,
      userId: data.userId,
      teamId: result[0].id,
    });
    return result[0];
  });

  return newTeamId;
};

export const createMasterTeam = async (data: NewTeam) => {
  const newTeamId = await db.transaction(async (tx) => {
    const validatedData = insertTeamSchema.parse(data);
    const result = await tx
      .insert(teamsTable)
      .values(validatedData)
      .returning({ id: teamsTable.id });
    return result[0];
  });

  return newTeamId;
};

export const getTeamById = async (id: number) => {
  const result = await db
    .select({
      id: teamsTable.id,
      name: teamsTable.name,
      slogan: teamsTable.slogan,
      state: teamsTable.state,
      isOpen: teamsTable.isOpen,
      raceId: teamsTable.raceId,
      userId: teamsTable.userId, // owner of the team
    })
    .from(teamsTable)
    .where(eq(teamsTable.id, id));
  // const team = selectTeamSchema.parse(result[0]);
  return result[0];
};

export type TeamById = Awaited<ReturnType<typeof getTeamById>>;

export const getTeamByName = async (name: string) => {
  const year = new Date().getFullYear().toString();
  const result = await db.query.teamsTable.findFirst({
    where: and(eq(teamsTable.name, name), eq(teamsTable.year, year)),
    columns: {
      id: true,
      name: true,
      isOpen: true,
      slogan: true,
    },
    with: {
      race: {
        columns: {
          name: true,
        },
      },
      session: true,
      raceEntriesToTeams: {
        columns: {
          userId: true,
        },
        with: {
          raceEntry: {
            with: {
              session: true,
            },
          },
        },
      },
      captain: {
        columns: {
          email: true,
        },
      },
    },
  });
  console.log(`getTeamByName result`, result);

  // only filter when result is presented
  if (result) {
    const raceEntries = result.raceEntriesToTeams.filter(
      (r) =>
        r.raceEntry?.session?.paymentStatus === 'paid' &&
        r.raceEntry.isActive === true,
    );
    return {
      ...result,
      raceEntriesToTeams: raceEntries,
    };
  } else {
    return undefined;
  }
};

export type TeamByName = Awaited<ReturnType<typeof getTeamByName>>;

//
export const getTeamMembersByOwner = async (id: number) => {
  const result = await db.query.teamsTable.findFirst({
    where: eq(teamsTable.userId, id),
    with: {
      race: true,
      session: {
        columns: {
          sessionId: true,
          status: true,
          paymentStatus: true,
        },
      },
      raceEntriesToTeams: {
        with: {
          raceEntry: {
            with: {
              session: true,
            },
          },
        },
      },
    },
  });
  console.log(`getTeamByOwner result`, result);
  if (!result) return null;
  const team = selectTeamSchema.parse(result);
  const race = selectRaceSchema.parse(result.race);
  const raceEntries = result.raceEntriesToTeams
    .map((r) => r.raceEntry)
    .filter((r) => r.session?.paymentStatus === 'paid' && r.isActive === true);
  return {
    ...team,
    race,
    payment: result.session,
    raceEntries: raceEntries,
    raceEntriesToTeams: result.raceEntriesToTeams.filter(
      (r) => r?.raceEntry?.session?.paymentStatus === 'paid',
    ),
  };
};

export type TeamByOwner = Awaited<ReturnType<typeof getTeamMembersByOwner>>;

export const getTeamByUserId = async (userId: number) => {
  const result = await db
    .select()
    .from(teamsTable)
    .leftJoin(racesTable, eq(teamsTable.raceId, racesTable.id))
    .where(eq(teamsTable.userId, userId));
  console.log(`getTeamByUid result`, result);
  if (result.length === 0) return null;
  const team = selectTeamSchema.parse(result[0].teams);
  const { password, ...rest } = team;
  return { ...rest, race: result[0].races };
};

export const getAllTeams = async () => {
  const result = await db.query.teamsTable.findMany({
    columns: {
      id: true,
      name: true,
      slogan: true,
      isOpen: true,
      raceId: true,
      userId: true,
    },
    with: {
      race: {
        columns: {
          id: true,
          name: true,
          isCompetitive: true,
          lowerAge: true,
          upperAge: true,
        },
      },
      captain: {
        columns: {
          email: true,
        },
      },
      session: true,
    },
  });
  console.log(`all teams result`, result);
  return result;
};

export type AllTeams = Awaited<ReturnType<typeof getAllTeams>>;

export const updateTeam = async (id: number, data: Partial<Team>) => {
  console.log(`updateTeam incoming data`, id, data);
  const validatedData = updateTeamSchema.parse(data);
  const result = await db
    .update(teamsTable)
    .set(validatedData)
    .where(eq(teamsTable.id, id));
  return result;
};

export const deleteTeam = async (id: number) => {
  const result = await db.delete(teamsTable).where(eq(teamsTable.id, id));
  return result;
};

export const validateTeamPassword = async (id: number, password: string) => {
  const result = await db
    .select()
    .from(teamsTable)
    .where(and(eq(teamsTable.id, id), eq(teamsTable.password, password)));
  return result.length > 0;
};

export const listTeamMembersByOwner = async (uid: number) => {
  // const result = await db.query.usersToTeamsTable.findMany({
  //   where: eq(usersToTeamsTable.teamId, id),
  //   with: {
  //     raceEntry: true,
  //   },
  // });
  // const validatedRaces = result.map((r) => selectUserSchema.parse(r.raceEntry));
  // return validatedRaces;
};

export const getTotalTeamsMembersById = async (
  id: number, // team id
) => {
  const result = await db
    .select({ value: count() })
    .from(raceEntriesToTeamsTable)
    .leftJoin(
      raceEntriesTable,
      and(
        eq(raceEntriesToTeamsTable.raceEntryId, raceEntriesTable.id),
        eq(raceEntriesTable.isActive, true),
      ),
    )
    .where(eq(raceEntriesToTeamsTable.teamId, id));
  return result[0].value;
};

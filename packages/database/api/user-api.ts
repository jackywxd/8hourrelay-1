import 'server-only';

import { and, eq } from 'drizzle-orm';

import {
  db,
  insertUserSchema,
  NewUser,
  selectUserSchema,
  teamsTable,
  updateUserSchema,
  User,
  usersTable,
  messagesTable,
  NewMessage,
} from '../db';

export const createUser = async (data: NewUser) => {
  const validatedData = insertUserSchema.parse(data);
  const result = await db
    .insert(usersTable)
    .values(validatedData)
    .returning({ id: usersTable.id });
  return result[0];
};

export const getUser = async (uid: string) => {
  const result = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.uid, uid));
  console.log(`result`, result);
  if (result.length === 0) return null;
  const user = selectUserSchema.safeParse(result[0]);
  if (!user.success) {
    console.log(user.error);
    return null;
  }
  return user.data;
};

export const getUserRole = async (teamId: number, userId: number) => {
  const result = await db.query.teamsTable.findFirst({
    where: and(eq(teamsTable.captainId, userId), eq(teamsTable.id, teamId)),
    with: {
      user: true,
    },
  });
  console.log(`result`, result);
  if (!result) return 'member';
  return 'captain';
};

export const getAllUsers = async () => {
  const result = await db.select().from(usersTable);

  return result.map((user) => selectUserSchema.parse(user));
};

export const updateUser = async (id: number, data: Partial<User>) => {
  const validatedData = updateUserSchema.parse(data);
  const result = await db
    .update(usersTable)
    .set(validatedData)
    .where(eq(usersTable.id, id));
  return result;
};

// get team created by the user(id) in the year
export const getUserTeam = async (
  id: number,
  year: string = new Date().getFullYear().toString(),
) => {
  const result = await db.query.teamsTable.findFirst({
    where: and(eq(teamsTable.userId, id), eq(teamsTable.year, year)),
    with: {
      race: true,
    },
  });
  // const result = await db
  //   .select()
  //   .from(usersToTeamsTable)
  //   .where(
  //     and(eq(usersToTeamsTable.userId, id), eq(usersToTeamsTable.year, year)),
  //   );
  console.log(`getUserTeams result`, result);
  return result;
};

export const createMessage = async (data: NewMessage) => {
  await db.insert(messagesTable).values(data).returning({
    id: messagesTable.id,
  });
};

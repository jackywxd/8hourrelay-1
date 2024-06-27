'use server';

import { revalidatePath } from 'next/cache';
import { cache } from 'react';
import 'server-only';

import { authenticate, logoutUser } from '@/queries/server/auth';
import { getUserAPI } from '@/queries/server/users';
import {
  getAllRaces,
  getTeamMembersByOwner,
  TeamByOwner,
  updateUser,
  updateUserSchema,
  User,
} from '@8hourrelay/database';

export const getCurrentUser = cache(async () => {
  try {
    const { user: session } = await authenticate();
    const { user } = await getUserAPI(session?.id ?? null);
    if (session && !user) {
      // if user is not found, logout the current session
      await logoutUser();
    }
    console.log('user', user);
    return user;
  } catch (error) {
    console.log(error);
    throw error;
  }
});

export const updateCurrentUser = async (data: Partial<User>, path: string) => {
  try {
    const user = await getCurrentUser();
    if (!user) throw new Error('User not found');
    console.log(`updateUser`, user, data);
    const newUser = {
      ...data,
      updatedAt: new Date(),
    };
    const validatedData = updateUserSchema.parse(newUser);
    await updateUser(user.id, validatedData);
    revalidatePath(path);
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const getUserTeam = cache(async () => {
  try {
    const user = await getCurrentUser();
    if (!user) throw new Error('User not found');
    const team: TeamByOwner = await getTeamMembersByOwner(user.id);
    return team;
  } catch (error) {
    console.log(error);
    throw error;
  }
});

export type IUserTeam = Awaited<ReturnType<typeof getUserTeam>>;

export const listRaces = cache(async () => {
  try {
    const races = await getAllRaces();
    console.log(`races`, races);
    return races;
  } catch (error) {
    console.log(error);
    throw error;
  }
});

export const isAuthenticated = cache(async () => {
  try {
    const user = await getCurrentUser();
    return !!user;
  } catch (error) {
    console.log(error);
    throw error;
  }
});

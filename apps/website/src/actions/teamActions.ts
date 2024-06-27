'use server';

import { revalidatePath } from 'next/cache';
import { cache } from 'react';
import 'server-only';

import {
  createMasterTeam,
  createOpenTeam,
  deleteTeam,
  getAllTeams,
  getTeamById,
  getTeamByName,
  getTeamMembersByOwner,
  insertTeamSchema,
  NewSession,
  NewTeam,
  Race,
  Team,
  updateTeam,
  validateTeamPassword,
} from '@8hourrelay/database';

import { createStripeSession } from './stripeApi';
import { getCurrentUser, getUserTeam } from './userActions';

export const listTeams = cache(async () => {
  try {
    const teams = await getAllTeams();
    // for open teams, only return alreayd paid teams
    return teams.filter(
      (t) =>
        t.race.isCompetitive !== true || // all master or youth team
        (t.session && t.session.status === 'complete') // open team with completed payment
    );
  } catch (error) {
    console.log(error);
    throw error;
  }
});

export const queryTeamName = cache(async (name: string) => {
  try {
    const team = await getTeamByName(name);
    return team;
  } catch (error) {
    console.log(error);
  }
});

export const queryTeamId = cache(async (id: number) => {
  try {
    const team = await getTeamById(id);
    return team;
  } catch (error) {
    console.log(error);
  }
});

export const queryTeamByOwner = cache(async () => {
  try {
    const user = await getCurrentUser();
    if (!user) throw new Error('User not found');
    const team = await getTeamMembersByOwner(user.id);
    return team;
  } catch (error) {
    console.log(error);
  }
});

export const createNewTeam = async (data: NewTeam, selectedRace: Race) => {
  try {
    const user = await getCurrentUser();
    if (!user) throw new Error('User not found');
    const year = new Date().getFullYear().toString();
    const newTeam: NewTeam = {
      ...data,
      year,
      state: 'init',
      userId: user.id, // owner is the user who created the team
      captainId: user.id, // captain is the user who created the team
    };
    const validatedTeamData = insertTeamSchema.parse(newTeam);

    // if the new team is Open which requires payment, create a stripe session and save it to db
    // then return the session id to the client to redirect to stripe checkout
    if (selectedRace.isCompetitive) {
      validatedTeamData.state = 'unpaid';
      const session = await createStripeSession(user, selectedRace);
      console.log(`created stripe session`, session);
      const newSession: NewSession = {
        sessionId: session.id,
        priceId: selectedRace.stripePrice.id,
        quantity: 12,
        productId: selectedRace.stripePrice.product as string,
        paymentIntentId: (session.payment_intent as string) ?? null, // null when payment is not completed
        status: session.status as string,
        paymentStatus: session.payment_status,
        amount: selectedRace.stripePrice.unit_amount
          ? +selectedRace.stripePrice.unit_amount
          : 0,
        currency: selectedRace.stripePrice.currency,
        expiresAt: new Date(session.expires_at * 1000),
        payload: session,
      };
      await createOpenTeam(validatedTeamData, newSession);
      return { id: session.id };
    }

    // for other teams, just create the team and return null
    await createMasterTeam({ ...validatedTeamData, state: 'completed' });
    return null;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const deleteUserTeam = async () => {
  try {
    const userTeam = await getUserTeam();
    if (!userTeam) return;
    await deleteTeam(userTeam.id);
    revalidatePath('/teams');
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const updateUserTeam = async (data: Partial<Team>) => {
  try {
    console.log(`updateUserTeam`, data);
    const userTeam = await getUserTeam();
    if (!userTeam) throw new Error('User team not found');
    await updateTeam(userTeam.id, data);
    revalidatePath('/teams');
    revalidatePath('/my-team');
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const isValidTeamPassword = async (id: number, password: string) => {
  try {
    const user = await getCurrentUser();
    if (!user) throw new Error('User not found');
    return validateTeamPassword(id, password);
  } catch (error) {
    console.log(error);
    throw error;
  }
};

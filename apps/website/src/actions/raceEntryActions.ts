'use server';

import { cache } from 'react';
import 'server-only';

import {
  AllRaces,
  createOpenRaceEntry,
  createPaidRaceEntry,
  findDuplicateRaceEntry,
  getPaymentSessionByTeamId,
  getRaceEntryById,
  getRaceEntryRosterById,
  getRaceEntryRosterByTeamId,
  getTeamById,
  getUserAllRaceEntries,
  insertRaceEntrySchema,
  NewRaceEntry,
  NewSession,
  Race,
  RaceEntry,
  Roster,
  selectRaceEntrySchema,
  TeamById,
  transferRosterToNewTeam,
  updateRaceEntry,
  updateRaceEntryOrder,
  updateRaceEntryRoster,
  UserAllRaceEntries,
} from '@8hourrelay/database';

import { revalidatePath } from 'next/cache';
import Stripe from 'stripe';
import { createStripeSession } from './stripeApi';
import { getCurrentUser } from './userActions';

export const createNewRaceEntry = async (
  data: Omit<NewRaceEntry, 'userId' | 'teamId' | 'sessionId'>,
  selectedRace: AllRaces[0],
  selectedTeam: TeamById
) => {
  try {
    console.log(`createNewRaceEntry`, data, selectedRace, selectedTeam);
    const user = await getCurrentUser();
    const year = new Date().getFullYear().toString();
    if (!user) throw new Error('User not found');
    const inputData: Omit<NewRaceEntry, 'sessionId'> = {
      ...data,
      email: user.email!,
      userId: user.id,
    };

    let session = null;
    if (!selectedRace.isCompetitive) {
      // we need session to retrieve payment intent and session
      session = await createStripeSession(user, selectedRace);
      console.log(`created stripe session`, session);

      const validatedRaceEntry = insertRaceEntrySchema.parse({
        ...inputData,
        year,
        sessionId: session.id,
      });

      console.log(`validatedRaceEntry`, validatedRaceEntry);
      const price = selectedRace.stripePrice as unknown as Stripe.Price;
      const newSession: NewSession = {
        sessionId: session.id,
        priceId: price.id,
        productId: price.product as string,
        paymentIntentId: (session.payment_intent as string) ?? null, // null when payment is not completed
        status: session.status as string,
        paymentStatus: session.payment_status,
        // session.expires_at is not in milliseconds
        expiresAt: new Date(session.expires_at * 1000),
        amount: price.unit_amount ? +price.unit_amount : 0,
        currency: price.currency,
        payload: session,
      };
      await createPaidRaceEntry(
        validatedRaceEntry,
        newSession,
        selectedTeam.id
      );
    } else {
      const session = await getPaymentSessionByTeamId(selectedTeam.id);
      console.log(`retrieved stripe session`, session);
      const validatedRaceEntry = insertRaceEntrySchema.parse({
        ...inputData,
        year,
        sessionId: session.sessionId,
      });
      await createOpenRaceEntry(validatedRaceEntry, selectedTeam.id);
    }

    // no need to revalidate as it will refresh the page
    // revalidatePath('/my-registrations');
    return session?.id;
  } catch (error) {
    // console.log(error);
    throw error;
  }
};

export const listUserRaceEntries = cache(async () => {
  try {
    const user = await getCurrentUser();
    if (!user) throw new Error('User not found');
    const races: UserAllRaceEntries = await getUserAllRaceEntries(user.id);
    const raceEntries = races.map((entry) => {
      if (!entry) return null;
      const { team, session, ...rest } = entry;
      const parsedData = selectRaceEntrySchema.parse(rest);
      return {
        ...parsedData,
        team,
        session,
        race: team?.race,
      };
    });
    return raceEntries;
  } catch (error) {
    console.log(error);
    throw error;
  }
});

export type IUserAllRaceEntries = Awaited<
  ReturnType<typeof listUserRaceEntries>
>;

export const updateTeamRoster = async (
  data: Pick<Roster, 'id' | 'raceOrder'>[]
) => {
  try {
    const user = await getCurrentUser();
    if (!user) throw new Error('User not found');
    await updateRaceEntryOrder(data);
    console.log(`updated roster`, data);
    revalidatePath('/my-team');
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const updateUserRaceEntry = async (id: number, data: Partial<Race>) => {
  try {
    const user = await getCurrentUser();
    if (!user) throw new Error('User not found');
    console.log(`updateRaceEntry`, data);
    const result = await updateRaceEntry(id, data);
    console.log(`updateRaceEntry result`, result);
    revalidatePath('/my-registrations');
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const updateEntryRoster = async (id: number, data: Partial<Roster>) => {
  try {
    const user = await getCurrentUser();
    if (!user) throw new Error('User not found');
    await updateRaceEntryRoster(id, data);
    console.log(`updated roster`, data);
    revalidatePath('/my-team');
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const getRosterById = cache(async (id: number) => {
  try {
    const user = await getCurrentUser();
    if (!user) throw new Error('User not found');
    const roster = await getRaceEntryRosterById(id);
    return roster;
  } catch (error) {
    console.log(error);
    throw error;
  }
});

export const getUserRaceEntryById = cache(async (id: number) => {
  try {
    const user = await getCurrentUser();
    if (!user) throw new Error('User not found');
    const raceEntries = await getRaceEntryById(id, user.id);
    return raceEntries;
  } catch (error) {
    console.log(error);
    throw error;
  }
});

export const getTeamRosterByTeamId = cache(async (id: number) => {
  try {
    const user = await getCurrentUser();
    if (!user) throw new Error('User not found');
    const rosters = await getRaceEntryRosterByTeamId(id);
    return rosters;
  } catch (error) {
    console.log(error);
    throw error;
  }
});

export const transferUserTeam = async (
  id: number, // roster id
  fromTeam: number, // current team Id
  toTeam: number // new team Id
) => {
  try {
    if (fromTeam === toTeam) {
      throw new Error('The current team is already your team');
    }
    // make sure the user is logged in
    const user = await getCurrentUser();
    if (!user) throw new Error('User not found');
    // make sure the roster exists
    const current = await getRaceEntryRosterById(id);
    const currentTeam = await getTeamById(fromTeam);

    if (!current) throw new Error('Roster not found');
    if (!currentTeam) throw new Error('Team not found');

    // make sure the current login user is the owner of the from team
    if (currentTeam.userId !== user.id) {
      throw new Error('You are not the owner of the team');
    }
    // make sure the team is part of the roster
    if (current.teamId !== fromTeam) {
      throw new Error('The team is not part of the roster');
    }
    // after transferred, we need to update the race order in the current team
    // no need to update the race order in the new team

    await transferRosterToNewTeam(id, fromTeam, toTeam);

    // await transferTeam(id, user.id, fromTeam, toTeam);
    revalidatePath('/my-team');
    revalidatePath('/teams');
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const isDuplicatedEntry = async (
  data: Pick<RaceEntry, 'firstName' | 'lastName' | 'birthYear' | 'gender'>
) => {
  try {
    const user = await getCurrentUser();
    if (!user) throw new Error('User not found');
    if (data.firstName && data.lastName && data.gender && data.birthYear) {
      const raceEntry = await findDuplicateRaceEntry({
        firstName: data.firstName,
        lastName: data.lastName,
        birthYear: data.birthYear,
        gender: data.gender,
      });
      if (raceEntry) {
        return true;
      }
    }
    return false;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
// check va
export const isRaceAgeValid = async (birthYear: string, race: AllRaces[0]) => {
  let upperYear = '',
    lowerYear = '';

  const year = new Date().getFullYear();
  if (race.lowerAge) upperYear = (year - race.lowerAge).toString();
  console.log(`upperYear`, upperYear);

  if (race.upperAge) lowerYear = (year - race.upperAge).toString();
  console.log(`lowerYear `, lowerYear);

  if (
    upperYear &&
    lowerYear &&
    birthYear <= upperYear &&
    birthYear >= lowerYear
  )
    return false;
  else if (!lowerYear && upperYear && birthYear < upperYear) return false;
  else if (!upperYear && lowerYear && birthYear >= lowerYear) return false;

  return true;
};

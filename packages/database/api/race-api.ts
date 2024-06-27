import 'server-only';

import { eq } from 'drizzle-orm';
import {
  Race,
  db,
  racesTable,
  selectRaceSchema,
  selectTeamSchema,
} from '../db';
import { listStripePrices } from './stripeApi';

export const getAllRaces = async () => {
  const year = new Date().getFullYear().toString();
  const result = await db.query.racesTable.findMany({
    where: eq(racesTable.year, year),
    with: {
      event: true,
      teams: true,
    },
  });

  // Check if race has stripe price and if not, fetch it from stripe and update the database;
  // only do this for races that don't have stripe price
  // make sure Stripe products have the corresponding lookup_key for each race product
  const lookup_key: string[] = [];
  for (const race of result) {
    if (race.lookupKey && !race.stripePrice) {
      lookup_key.push(race.lookupKey);
    }
  }
  if (lookup_key.length > 0) {
    const prices = await listStripePrices(lookup_key);
    if (prices && prices.data.length > 0) {
      for (const race of result) {
        const price = prices.data.find((p) => p.lookup_key === race.lookupKey);
        if (price && !race.stripePrice) {
          race.stripePrice = price;
          await db
            .update(racesTable)
            .set({ stripePrice: price })
            .where(eq(racesTable.id, race.id));
        }
      }
    }
  }

  return result.map((team) => {
    const validatedData = selectRaceSchema.parse(team);
    const teams = team.teams.map((t) => {
      const { password, ...validatedTeam } = selectTeamSchema.parse(t);
      return validatedTeam;
    });
    return { ...validatedData, teams } as Race<'teams'>;
  });
};

// retrieve race by lookup key from the database
// this function will return null if the race is not found
// return with password
export const getRaceByLookupKey = async (lookupKey: string) => {
  const result = await db.query.racesTable.findFirst({
    where: eq(racesTable.lookupKey, lookupKey),
    with: {
      event: true,
      teams: true,
    },
  });

  if (!result) {
    return null;
  }

  if (result.lookupKey && !result.stripePrice) {
    const prices = await listStripePrices([result.lookupKey]);
    if (prices && prices.data.length > 0) {
      result.stripePrice = prices.data[0];
      await db
        .update(racesTable)
        .set({ stripePrice: prices.data[0] })
        .where(eq(racesTable.id, result.id));
    }
  }

  const validatedData = selectRaceSchema.parse(result);
  const teams = result.teams.map((t) => {
    const validatedTeam = selectTeamSchema.parse(t);
    return validatedTeam;
  });
  return { ...validatedData, teams } as Race<'teams'>;
};

// retrieve race by lookup key from the database
// this function will return null if the race is not found
// return with password
export const getRaceById = async (id: number) => {
  const result = await db.query.racesTable.findFirst({
    where: eq(racesTable.id, id),
    with: {
      event: true,
    },
  });

  if (!result) {
    return null;
  }

  if (result.lookupKey && !result.stripePrice) {
    const prices = await listStripePrices([result.lookupKey]);
    if (prices && prices.data.length > 0) {
      result.stripePrice = prices.data[0];
      await db
        .update(racesTable)
        .set({ stripePrice: prices.data[0] })
        .where(eq(racesTable.id, result.id));
    }
  }

  const validatedData = selectRaceSchema.parse(result);

  return validatedData as Race;
};

import { db, NewRace } from './index';
import {
  eventsTable,
  insertEventSchema,
  insertRaceSchema,
  racesTable,
} from './schema';

const year = '2024';

const event2024 = {
  year,
  name: `8HourRelay`,
  description: `8 Hour Relay Race - 2024`,
  location: 'South Surrey Athletic Park, British Columbia',
  time: 'Sep 7, 2024',
  isActive: true,
  createdAt: new Date(),
  registerDeadline: 'August 25, 2024',
};
const races: NewRace[] = [
  {
    year,
    name: 'Open',
    description: '8 Hour Relay - Open Race',
    entryFee: 35,
    isCompetitive: true,
    lowerAge: 18,
    maxTeamSize: 12,
    minFemale: 4,
    lookupKey: 'open_entry_fee',
  },
  {
    year,
    name: 'Master',
    description: '8 Hour Relay - Master Race',
    entryFee: 35,
    maxTeamSize: 24,
    isCompetitive: false,
    lowerAge: 18,
    lookupKey: 'master_entry_fee',
  },
  {
    year,
    name: 'Youth',
    description: '4 Hour Youth Relay',
    entryFee: 20,
    isCompetitive: false,
    maxTeamSize: 24,
    lowerAge: 10,
    upperAge: 18,
    lookupKey: 'youth_entry_fee',
  },
];
const seeds = async () => {
  const validatedEvent = insertEventSchema.parse(event2024);
  console.log(validatedEvent);
  const result = await db
    .insert(eventsTable)
    .values(validatedEvent)
    .onConflictDoUpdate({
      target: eventsTable.year,
      set: { createdAt: new Date() },
    })
    .returning({ id: eventsTable.id });
  console.log(result);

  for (const race of races) {
    const validatedRace = insertRaceSchema.parse({ ...race });
    console.log(validatedRace);
    await db
      .insert(racesTable)
      .values({ ...validatedRace, eventId: result[0].id })
      .returning({ id: racesTable.id });
  }
  console.log(`seeds done`);
};

seeds();

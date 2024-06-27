import * as fs from 'fs';
import dotenv from 'dotenv';
import { parseFile } from '@fast-csv/parse';
import {
  insertEventSchema,
  selectUserSchema,
  insertUserSchema,
  usersTable,
} from './schema';
import { NewUser, db } from './db';

dotenv.config();

const year = '2024';
const event2024 = {
  year,
  name: `8HourRelay`,
  description: `8 Hour Relay Race - 2024`,
  location: 'South Surrey Athletic Park, British Columbia',
  time: 'Sep 7, 2024',
  isActive: true,
  createdAt: new Date(),
  registerDeadline: 'August 31, 2024',
};
const races = [
  {
    year,
    name: 'Adult Race',
    description: '8 Hour Relay - Competitive',
    entryFee: 35,
    isCompetitive: true,
    lowerAge: 18,
  },
  {
    year,
    name: 'Adult Race',
    description: '8 Hour Relay - Recreational',
    entryFee: 35,
    isCompetitive: false,
    lowerAge: 18,
  },
  {
    year,
    name: 'Kids',
    description: '4 Hour Youth Relay',
    entryFee: 20,
    isCompetitive: false,
    lowerAge: 10,
    upperAge: 18,
  },
];
const parseUserData = () => {
  const event2023Validate = insertEventSchema.safeParse(event2024);
  if (!event2023Validate.success) {
    console.log(event2023Validate.error);
  } else {
    console.log(event2023Validate.data);
  }

  parseFile('./db/users.csv', { headers: true, objectMode: true })
    .transform((row) => {
      console.log(`prior row`, row);
      return {
        ...row,
        address: row.address ? row.address : '',
        role: row.role ? row.role : 'member',
        emailVerified: row.emailVerified === 'true',
        createdAt: row.createdAt ? new Date(+row.createdAt) : new Date(),
        updatedAt: row.updatedAt ? new Date(+row.updatedAt) : new Date(),
      };
    })
    .on('error', (error) => console.error(error))
    .on('data', async (row) => {
      console.log(row);
      const userValidate = insertUserSchema.safeParse(row);
      if (!userValidate.success) {
        console.log(userValidate.error);
      } else {
        console.log(userValidate.data);
        await db.insert(usersTable).values(userValidate.data as NewUser);
      }
    })
    .on('end', (rowCount: number) => console.log(`Parsed ${rowCount} rows`));
};

parseUserData();

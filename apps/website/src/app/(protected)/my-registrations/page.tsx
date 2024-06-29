import {
  IUserAllRaceEntries,
  listUserRaceEntries,
} from '@/actions/raceEntryActions';
import { FormSkeleton } from '@/components/FormSkeleton';
import { DashboardHeader } from '@/components/header';
import { RaceEntryCreateButton } from '@/components/race-create-button';
import { Suspense } from 'react';
import RaceEntries from './RaceEntries';

export default async function MyRegistrationsPage() {
  const raceEntries: IUserAllRaceEntries = await listUserRaceEntries();
  console.log(`raceEntries`, raceEntries);
  return (
    <div className="w-full">
      <DashboardHeader
        heading="My Registration"
        text="Manage your registration. You can register multiple race entries for different persons using different email and phone number."
      >
        <RaceEntryCreateButton />
      </DashboardHeader>
      <div className="mt-5">
        <Suspense fallback={<FormSkeleton items={5} />}>
          <RaceEntries raceEntries={raceEntries} />
        </Suspense>
      </div>
    </div>
  );
}

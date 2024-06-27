import { Suspense } from 'react';

import { getRosterById } from '@/actions';
import { FormSkeleton } from '@/components/FormSkeleton';
import { DashboardHeader } from '@/components/header';
import { DashboardShell } from '@/components/shell';
import { capitalize } from '@/lib/utils';
import { getAllTeams } from '@8hourrelay/database';
import { SelectTeam } from '@/components/SelectTeam';
import { EditRoster } from '@/components/EditRoster';
import { CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

const RosterPage = async ({
  params: { id },
  searchParams,
}: {
  params: { id: string };
  searchParams: any;
}) => {
  const roster = await getRosterById(+id);
  const teams = await getAllTeams();
  const action = searchParams.action;
  console.log(`Team Page`, teams, roster);

  if (!roster) {
    return null;
  }

  return (
    <DashboardShell>
      <DashboardHeader
        heading={`${capitalize(roster?.team?.name)}`}
        // text={`Email: ${roster?.raceEntry.email}`}
      ></DashboardHeader>
      <CardHeader>
        <CardTitle>
          Name:{' '}
          {capitalize(
            roster?.raceEntry.preferName ??
              `${roster?.raceEntry.firstName} ${roster?.raceEntry.lastName}`
          )}
        </CardTitle>
        <CardDescription>Email: {roster?.raceEntry.email}</CardDescription>
        <CardTitle>Bib#: {roster?.bib ?? 'N/A'}</CardTitle>
      </CardHeader>
      <div className="grid gap-10">
        <Suspense fallback={<FormSkeleton items={5} />}>
          {action === 'transfer' ? (
            <SelectTeam teams={teams} roster={roster} />
          ) : (
            <EditRoster roster={roster} />
          )}
        </Suspense>
      </div>
    </DashboardShell>
  );
};

export default RosterPage;

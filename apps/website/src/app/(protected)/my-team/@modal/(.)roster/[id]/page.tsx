import { Suspense } from 'react';

import { getRosterById } from '@/actions/raceEntryActions';
import { EditRoster } from '@/components/EditRoster';
import { FormSkeleton } from '@/components/FormSkeleton';
import { Modal } from '@/components/Modal';
import { SelectTeam } from '@/components/SelectTeam';
import { CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { capitalize } from '@/lib/utils';
import { getAllTeams } from '@8hourrelay/database';

const RosterPage = async ({
  params: { id },
  searchParams,
}: {
  params: { id: string };
  searchParams: any;
}) => {
  if (!id) return null;
  const roster = await getRosterById(+id);
  const teams = await getAllTeams();
  const action = searchParams.action;
  console.log(`Team Page`, teams, roster);

  if (!roster) {
    return null;
  }
  return (
    <Modal>
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
      <Suspense fallback={<FormSkeleton items={5} />}>
        {action === 'transfer' ? (
          <SelectTeam teams={teams} roster={roster} />
        ) : (
          <EditRoster roster={roster} />
        )}
      </Suspense>
    </Modal>
  );
};

export default RosterPage;

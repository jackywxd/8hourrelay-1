import { getUserRaceEntryById } from '@/actions/raceEntryActions';
import { DashboardHeader } from '@/components/header';
import { DashboardShell } from '@/components/shell';
import { FormSkeleton } from '@/components/FormSkeleton';
import { Suspense } from 'react';
import { capitalize } from '@/lib/utils';
import { EmptyPlaceholder } from '@/components/empty-placeholder';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

import { Modal } from '@/components/Modal';
import { EditTeamRoster } from '@/components/EditTeamRoster';
import { EditRaceEntry } from '@/components/editRaceEntryById';

const RaceEntryPage = async ({
  params: { id },
}: {
  params: { id: string };
}) => {
  const raceEntry = await getUserRaceEntryById(+id);
  console.log(`raceEntries`, raceEntry);
  if (!raceEntry) {
    return null;
  }
  return (
    <DashboardShell>
      <DashboardHeader></DashboardHeader>

      <div className="grid gap-10">
        <Suspense fallback={<FormSkeleton items={5} />}>
          <EditRaceEntry raceEntry={raceEntry} />
        </Suspense>
      </div>
    </DashboardShell>
  );
};

export default RaceEntryPage;

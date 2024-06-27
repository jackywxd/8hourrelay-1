'use client';
import { useRouter } from 'next/navigation';
import { useMemo, useTransition } from 'react';

import { RaceEntry, Roster } from '@8hourrelay/database';

import { columns } from './_components/columns';
import { DataTable } from './_components/data-table';

export function RaceEntriesTable({
  raceEntries,
  roster,
}: {
  raceEntries: RaceEntry[];
  roster: Roster[];
}) {
  // console.log(roster);
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  const data = useMemo(() => {
    const sortedRosters = roster.sort((a, b) => {
      if (a && b) {
        return (a.raceOrder || 0) - (b.raceOrder || 0);
      } else {
        return 0;
      }
    });
    const newRoster: any[] = [];
    // console.log(`sortedRaces`, sortedRosters);
    sortedRosters.forEach((race: Roster) => {
      const entry = raceEntries.find((entry) => entry.id === race?.raceEntryId);
      if (entry) {
        newRoster.push({
          id: entry.id,
          name: entry?.preferName
            ? entry?.preferName
            : `${entry?.firstName} ${entry?.lastName}`,
          email: entry.email,
          gender: entry.gender,
          order: race?.raceOrder,
          bib: race?.bib,
          timeSlot: race?.raceDuration,
        });
      }
    });

    return newRoster;
  }, [roster, raceEntries]);

  function onSave() {
    startTransition(async () => {
      // await updateTeamRoster(roster);
      router.refresh();
    });
  }

  return (
    <div className="mt-5 w-full">
      <DataTable columns={columns} data={data} />
    </div>
  );
}

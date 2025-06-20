'use client';
import { useRouter } from 'next/navigation';
import { useMemo, useTransition } from 'react';

import { Roster } from '@8hourrelay/database';

import { IUserTeam } from '@/actions/userActions';
import { columns } from './_components/columns';
import { DataTable } from './_components/data-table';

export function RaceEntriesTable({
  race,
  raceEntries,
  roster,
}: {
  race: NonNullable<IUserTeam>['race'];
  raceEntries: NonNullable<IUserTeam>['raceEntries'];
  roster: NonNullable<IUserTeam>['raceEntriesToTeams'];
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
    sortedRosters.forEach((r: Roster) => {
      const entry = raceEntries.find((entry) => entry.id === r?.raceEntryId);
      if (entry) {
        newRoster.push({
          id: entry.id,
          name: entry?.preferName
            ? entry?.preferName
            : `${entry?.firstName} ${entry?.lastName}`,
          email: entry.email,
          gender: entry.gender,
          order: r?.raceOrder,
          bib: r?.bib,
          timeSlot: r?.raceDuration,
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
      {/* Open race is not editable */}
      <DataTable
        columns={!race?.isCompetitive ? columns : columns.slice(0, 6)}
        data={data}
        isEditable={!race.isCompetitive}
      />
    </div>
  );
}

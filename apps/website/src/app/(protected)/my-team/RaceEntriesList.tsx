'use client';
import { Reorder } from 'framer-motion';
import { useEffect, useMemo, useState, useTransition } from 'react';

import { updateTeamRoster } from '@/actions/raceEntryActions';
import { IUserTeam } from '@/actions/userActions';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { RaceEntryItem } from './RaceEntryItem';

export function RaceEntriesList({
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
  const [items, setItems] = useState([...Array(raceEntries.length).keys()]);
  const [dirty, setDirty] = useState(false);

  const [sortedEntries, sortedRosters] = useMemo(() => {
    const sortedRosters = roster.sort((a, b) => {
      if (a && b) {
        return (a.raceOrder || 0) - (b.raceOrder || 0);
      } else {
        return 0;
      }
    });
    // console.log(`sortedRaces`, sortedRosters);
    const sortedEntries = sortedRosters.map((race) => {
      return raceEntries.find((entry) => entry.id === race?.raceEntryId);
    });

    return [sortedEntries, sortedRosters];
  }, [raceEntries, roster]);

  function onSave() {
    startTransition(async () => {
      // console.log(`new order is`, sortedEntries, items);
      const s = items.map((item, index) => {
        return sortedEntries[item];
      });
      // console.log(`s`, s);
      items.forEach((item, index) => {
        roster[item].raceOrder = index + 1;
      });
      // console.log(`ss`, roster);
      setDirty(false);
      await updateTeamRoster(roster);
      router.refresh();
    });
  }

  // order has been changed
  useEffect(() => {
    if ([...Array(raceEntries.length).keys()].join('') !== items.join('')) {
      setDirty(true);
    } else {
      setDirty(false);
    }
  }, [items.join('')]);

  return (
    <div className="mt-5 flex flex-col">
      {dirty && (
        <Button onClick={onSave}>{pending ? 'Saving...' : 'Save'}</Button>
      )}
      <Reorder.Group
        values={items}
        onReorder={(newOrder) => {
          console.log(newOrder);
          setItems(newOrder);
        }}
        className="flex flex-col gap-2"
      >
        {items.map((item, index) => (
          <Reorder.Item value={item} key={sortedEntries[item]?.id}>
            <RaceEntryItem
              id={index + 1}
              raceEntry={{
                ...sortedEntries[item],
                isCompetitive: race.isCompetitive,
              }} // sortedEntries[item]}
              roster={sortedRosters[item]}
            />
          </Reorder.Item>
        ))}
      </Reorder.Group>
    </div>
  );
}

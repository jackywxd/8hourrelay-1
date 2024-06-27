import { RaceEntry, Roster } from '@8hourrelay/database';
import { MdWoman2, MdMan2, MdEdit, MdPersonRemove } from 'react-icons/md';
import Link from 'next/link';
import { capitalize } from '@/lib/utils';

export const RaceEntryItem = ({
  id,
  raceEntry,
  roster,
}: {
  id: number;
  raceEntry: RaceEntry;
  roster: Roster;
}) => {
  if (!raceEntry) return null;
  const race = raceEntry;
  return (
    <div className="group relative mt-3 flex items-center gap-5 rounded-lg bg-muted px-2 py-4 shadow-md transition hover:bg-accent hover:text-accent-foreground focus:outline-none aria-checked:border-indigo-500 aria-checked:ring-1 aria-checked:ring-indigo-500 aria-checked:ring-offset-1">
      <div>{id}</div>
      <div className="flex w-full items-center justify-between">
        <div className="flex w-3/4 flex-col justify-between text-left md:flex-row">
          <div className="flex items-center justify-between text-left md:w-1/3">
            <div className="flex items-center gap-2">
              {race.gender === 'Male' ? (
                <MdMan2 size={24} />
              ) : (
                <MdWoman2 size={24} />
              )}
              <span className="text-left text-sm">
                {capitalize(
                  race?.preferName
                    ? race.preferName
                    : `${race?.firstName} ${race?.lastName}`
                )}
              </span>
            </div>
          </div>
          <span className="text-left text-sm md:w-1/3">
            Bib: {roster.bib ?? 'N/A'}
          </span>
          <span className="text-left text-sm">
            Allocated Time: {roster.raceDuration ?? 'N/A'}
          </span>
        </div>
        <div className="flex gap-3">
          <Link href={`/my-team/roster/${roster.id}?action=edit`}>
            <MdEdit size={24} />
          </Link>
          <Link href={`/my-team/roster/${roster.id}?action=transfer`}>
            <MdPersonRemove size={24} />
          </Link>
        </div>
      </div>
    </div>
  );
};

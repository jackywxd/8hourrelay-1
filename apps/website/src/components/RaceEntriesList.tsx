import Link from 'next/link';

import { IUserAllRaceEntries } from '@/actions/raceEntryActions';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { capitalize } from '@/lib/utils';
import { Icons } from './icons';

export function RaceEntriesList({
  raceEntries,
}: {
  raceEntries: IUserAllRaceEntries;
}) {
  return (
    <div className="flex flex-col">
      {raceEntries.map((raceEntry, index) => (
        <RaceEntryItem
          key={raceEntry?.id ?? `${raceEntry?.email}${index}`}
          raceEntry={raceEntry}
        />
      ))}
    </div>
  );
}

const RaceEntryItem = ({
  raceEntry,
}: {
  raceEntry: IUserAllRaceEntries[0];
}) => {
  if (!raceEntry) return null;
  const race = raceEntry;
  return (
    <Link href={`/my-registrations/entry/${raceEntry.id}`}>
      <div className="group relative mt-3 flex rounded-lg bg-muted px-2 py-4 shadow-md transition hover:bg-accent hover:text-accent-foreground focus:outline-none aria-checked:border-indigo-500 aria-checked:ring-1 aria-checked:ring-indigo-500 aria-checked:ring-offset-1">
        <div className="hidden w-1/4 items-center justify-between gap-4 md:block">
          <Avatar className="h-12 w-12 mix-blend-difference">
            <AvatarImage
              src={
                raceEntry.race?.name === 'Master' ||
                raceEntry.race?.name === 'Open'
                  ? '/img/icon_adult.svg'
                  : '/img/icon_youth.svg'
              }
              alt="Avatar"
            />
            <AvatarFallback>
              {capitalize(
                race?.preferName
                  ? race.preferName
                  : `${race?.firstName} ${race?.lastName}`
              )}
            </AvatarFallback>
          </Avatar>
        </div>
        <div className="flex w-full items-center justify-around">
          <>
            <span>
              {capitalize(
                race?.preferName
                  ? race.preferName
                  : `${race?.firstName} ${race?.lastName}`
              )}
            </span>
            <span>{race.email}</span>
          </>
          <Link href={`/teams/${encodeURIComponent(raceEntry.team.name)}`}>
            <span className="hidden items-center text-sm font-medium uppercase leading-none underline md:block">
              {raceEntry.team.name}
            </span>
          </Link>
          <div className="hidden md:block">
            {raceEntry.session?.paymentStatus === 'paid' ? (
              <Icons.check className="h-6 w-6 text-green-500" />
            ) : (
              <div>
                <div>
                  <Link
                    href={`/payment?session=${raceEntry.session?.sessionId}`}
                    target="_blank"
                  >
                    Payment
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
};

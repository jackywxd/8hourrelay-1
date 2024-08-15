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
    <div className="group relative mt-3 flex w-full rounded-lg bg-muted px-2 py-4 shadow-md transition hover:bg-accent hover:text-accent-foreground focus:outline-none aria-checked:border-indigo-500 aria-checked:ring-1 aria-checked:ring-indigo-500 aria-checked:ring-offset-1">
      <div className="flex w-full items-center justify-around">
        <div className="hidden w-1/4 items-center justify-between gap-4 md:block">
          <Avatar className="mx-auto h-12 w-12 mix-blend-difference">
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
        <Link
          className="w-full"
          href={`/my-registrations/entry/${raceEntry.id}`}
        >
          <div className="flex w-full items-center justify-around">
            <div>
              {capitalize(
                race?.preferName
                  ? race.preferName
                  : `${race?.firstName} ${race?.lastName}`
              )}
            </div>
            <div>{race.email}</div>
          </div>
        </Link>
        <div className="w-1/4 items-center justify-between">
          <Link href={`/teams/${encodeURIComponent(raceEntry.team.name)}`}>
            <span className="hidden items-center text-sm font-medium uppercase leading-none underline md:block">
              {raceEntry.team.name}
            </span>
          </Link>
        </div>
      </div>
      <div className="flex w-1/4 items-center justify-center">
        {raceEntry.session?.paymentStatus === 'paid' ? (
          <Icons.check className="h-6 w-6 text-green-500" />
        ) : (
          <div>
            <div>
              <Link
                href={`/payment?session=${raceEntry.session?.sessionId}`}
                target="_blank"
              >
                <span>Pay</span>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

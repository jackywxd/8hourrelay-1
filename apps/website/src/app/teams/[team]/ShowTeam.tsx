import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { getTeamLogoUrl } from './getTeamLogoUrl';
import { Team } from '@8hourrelay/database';
import ShareButtons from './ShareButtons';
import { capitalize } from '@/lib/utils';

export default async function TeamPage({ team }: { team: Team }) {
  const ogUrl = getTeamLogoUrl(team);
  console.log(`ogUrl`, ogUrl);
  const shareUrl = `${process.env.NEXT_PUBLIC_HOST_NAME}/teams/${encodeURIComponent(team.name)}`;
  return (
    <>
      <div className="flex w-full flex-col md:ml-5 md:pt-5">
        <div>Captain Email: {team?.captain?.email}</div>
        <div>Total team members: {team?.raceEntriesToTeams?.length}</div>
        <div className="m-3 flex w-full flex-row-reverse gap-3 p-3">
          {team.isOpen && (
            <Link href={`/registration?action=join&teamId=${team?.id}`}>
              <Button>Join {capitalize(team.name)}</Button>
            </Link>
          )}
          {/* <Link href={`/account/teams/${team.id}`}>
            <Button>Details</Button>
          </Link> */}
        </div>
        <ShareButtons
          url={shareUrl}
          title={`Join my relay team ${team.name}`}
        />
        <div className="m-2 mx-auto">
          <img
            className="rounded-md"
            src={ogUrl}
            alt={`Team ${team.name} image`}
            width={1200}
            height={630}
            style={{ maxWidth: '100%', height: 'auto' }}
          />
        </div>
      </div>
    </>
  );
}

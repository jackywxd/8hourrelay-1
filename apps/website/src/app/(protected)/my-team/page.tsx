import { getUserTeam } from '@/actions';
import { DashboardHeader } from '@/components/header';
import { DashboardShell } from '@/components/shell';
import { FormSkeleton } from '@/components/FormSkeleton';
import { Suspense } from 'react';
import RaceEntries from './RaceEntries';
import { EditTeamSettings } from './EditTeamSettings';
import { capitalize } from '@/lib/utils';
import { EmptyPlaceholder } from '@/components/empty-placeholder';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

const MyTeamPage = async () => {
  const team = await getUserTeam();

  console.log(`Team Page races`, team?.raceEntries.length, team?.raceEntries);
  if (!team) {
    return (
      <EmptyPlaceholder>
        <EmptyPlaceholder.Icon name="users" />
        <EmptyPlaceholder.Title>
          You don't have any team yet
        </EmptyPlaceholder.Title>
        <EmptyPlaceholder.Description>
          Create your team and invite your friends to join.
        </EmptyPlaceholder.Description>
        <Button variant="default">
          <Link className="link open-button" href="/teams/create-team">
            Create Team
          </Link>
        </Button>
      </EmptyPlaceholder>
    );
  }

  return (
    <DashboardShell>
      <DashboardHeader
        heading={`${capitalize(team?.name)}`}
        text="Manage your race team, change race order and update team member information."
      >
        <EditTeamSettings team={team} />
      </DashboardHeader>

      <div className="flex gap-10">
        <Suspense fallback={<FormSkeleton items={5} />}>
          <RaceEntries team={team} />
        </Suspense>
      </div>
    </DashboardShell>
  );
};

export default MyTeamPage;

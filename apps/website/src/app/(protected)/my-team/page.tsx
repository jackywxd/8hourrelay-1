import { getUserTeam } from '@/actions/userActions';
import { EmptyPlaceholder } from '@/components/empty-placeholder';
import { FormSkeleton } from '@/components/FormSkeleton';
import { DashboardHeader } from '@/components/header';
import { DashboardShell } from '@/components/shell';
import { Button } from '@/components/ui/button';
import { capitalize } from '@/lib/utils';
import Link from 'next/link';
import { Suspense } from 'react';
import { EditTeamSettings } from './EditTeamSettings';
import RaceEntries from './RaceEntries';

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

  if (team.payment?.sessionId && team.payment?.status !== 'complete') {
    return (
      <div className="mt-10 flex h-full w-full flex-col items-center">
        <EmptyPlaceholder>
          <EmptyPlaceholder.Icon name="save" className="text-red-500" />
          <EmptyPlaceholder.Title>
            Your open team {capitalize(team.name)} was saved with unfinished
            payment. Please press the Payment button below to complete the
            payment.
          </EmptyPlaceholder.Title>
          <EmptyPlaceholder.Description></EmptyPlaceholder.Description>
          <Link
            href={`/payment?session=${team.payment.sessionId}`}
            target="_blank"
          >
            <Button className="w-full">Payment</Button>
          </Link>
        </EmptyPlaceholder>
      </div>
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

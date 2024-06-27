import Link from 'next/link';
import { redirect } from 'next/navigation';
import { Suspense } from 'react';

import { getCurrentUser, listRaces, queryTeamId } from '@/actions';
import { EmptyPlaceholder } from '@/components/empty-placeholder';
import { FormSkeleton } from '@/components/FormSkeleton';
import { DashboardHeader } from '@/components/header';
import { DashboardShell } from '@/components/shell';
import { Button } from '@/components/ui/button';

import RegistrationSteps from './registrationSteps';

const CUT_OFF_DATE =
  process.env.NEXT_PUBLIC_CUT_OFF_DATE ?? '2024-08-31T23:59:59-07:00';

// accept incoming action and target in the url
// ops[0] = action (join, create, edit and etc)
// ops[1] = target (team name, user id and etc)
async function RegistrationPage({ searchParams }) {
  const action = searchParams.action;
  const teamId = searchParams.teamId;
  const raceId = searchParams.raceId;

  // cutoff date
  const cutoffDate = new Date(CUT_OFF_DATE).getTime();

  if (new Date().getTime() > cutoffDate) {
    return (
      <EmptyPlaceholder>
        <EmptyPlaceholder.Icon name="close" className="text-red-500" />
        <EmptyPlaceholder.Title>
          Year 2024 registration is closed!
        </EmptyPlaceholder.Title>
        <EmptyPlaceholder.Description></EmptyPlaceholder.Description>
        <Link href="/">Go Home Now</Link>
      </EmptyPlaceholder>
    );
  }

  const user = await getCurrentUser();

  if (!user) {
    redirect('/auth');
  }
  const [races] = await Promise.all([listRaces()]);
  console.log(`races `, races);

  if (action === 'join') {
    if (!teamId) {
      redirect('/registration');
    }
    const team = await queryTeamId(teamId);
    console.log(`team id ${teamId} data`, { team });

    if (team && !team?.isOpen) {
      return (
        <EmptyPlaceholder>
          <EmptyPlaceholder.Icon name="users" className="text-red-500" />
          <EmptyPlaceholder.Title>
            {team.name} is not open for registration.
          </EmptyPlaceholder.Title>
          <EmptyPlaceholder.Description>
            The captain may just close the registration. Please contact the
            captain or join another team.
          </EmptyPlaceholder.Description>
          <Link href="/teams">
            <Button>See all teams</Button>
          </Link>
        </EmptyPlaceholder>
      );
    }

    return (
      <DashboardShell>
        <DashboardHeader
          heading="Registration"
          text="Register to participate in the 2024 8 Hour Relay."
        ></DashboardHeader>
        <div className="flex h-full w-full flex-1 flex-col">
          <Suspense fallback={<FormSkeleton items={5} />}>
            <RegistrationSteps races={races} team={team} />
          </Suspense>
        </div>
      </DashboardShell>
    );
  }

  return (
    <DashboardShell>
      <DashboardHeader
        heading="Registration"
        text="Register to participate in the 2024 8 Hour Relay."
      ></DashboardHeader>
      <div className="flex h-full w-full flex-1 flex-col">
        <Suspense fallback={<FormSkeleton items={5} />}>
          <RegistrationSteps races={races} />
        </Suspense>
      </div>
    </DashboardShell>
  );
}

export default RegistrationPage;

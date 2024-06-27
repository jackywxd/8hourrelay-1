import { redirect } from 'next/navigation';
import { Suspense } from 'react';

import { getCurrentUser, getUserTeam, listRaces } from '@/actions/userActions';
import { EmptyPlaceholder } from '@/components/empty-placeholder';
import { FormSkeleton } from '@/components/FormSkeleton';
import { DashboardHeader } from '@/components/header';
import { DashboardShell } from '@/components/shell';
import { capitalize } from '@/lib/utils';
import Link from 'next/link';
import CreateTeamSteps from './CreateTeamsController';

export default async function Home() {
  const user = await getCurrentUser();
  if (!user) {
    redirect('/auth?next=/teams/create-team');
  }
  // retrieve all races and the team created by current login user
  const [races, team] = await Promise.all([listRaces(), getUserTeam()]);
  console.log(`races `, races, team);

  // if team exists, team members page
  if (team) {
    if (team?.race?.isCompetitive && team?.payment?.paymentStatus !== 'paid') {
      return (
        <div className="mt-10 flex h-full w-full flex-col items-center">
          <EmptyPlaceholder>
            <EmptyPlaceholder.Icon name="warning" className="text-yellow-400" />
            <EmptyPlaceholder.Title>
              You already created a team: {capitalize(team?.name)}. Please
              complete the payment first.
            </EmptyPlaceholder.Title>
            <EmptyPlaceholder.Description></EmptyPlaceholder.Description>
            <div className="flex gap-5">
              <Link
                href={`/payment?session=${team.payment?.sessionId}`}
                target="_blank"
              >
                Payment
              </Link>
              <Link href="/my-team">My Team</Link>
            </div>
          </EmptyPlaceholder>
        </div>
      );
    }
    return (
      <div className="mt-10 flex h-full w-full flex-col items-center">
        <EmptyPlaceholder>
          <EmptyPlaceholder.Icon name="warning" className="text-yellow-400" />
          <EmptyPlaceholder.Title>
            You already created a team: {capitalize(team?.name)}. You can only
            have one team.
          </EmptyPlaceholder.Title>
          <EmptyPlaceholder.Description></EmptyPlaceholder.Description>
          <div className="flex gap-5">
            <Link href="/">Home</Link>
            <Link href="/my-team">My Team</Link>
          </div>
        </EmptyPlaceholder>
      </div>
    );
  }

  return (
    <div className="container mx-auto mt-10 flex">
      <section className="flex w-full flex-1 flex-col pl-1 pr-1">
        <DashboardShell>
          <DashboardHeader
            heading="Create a Team"
            text="Create your Team."
          ></DashboardHeader>
          <div className="flex w-full flex-1">
            <Suspense fallback={<FormSkeleton items={2} />}>
              <CreateTeamSteps races={races} />
            </Suspense>
          </div>
        </DashboardShell>
      </section>
    </div>
  );
}

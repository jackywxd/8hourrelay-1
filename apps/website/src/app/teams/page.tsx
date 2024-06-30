import { Suspense } from 'react';
import Link from 'next/link';
import DisplayTeams from './DisplayTeams';

import './teams.css';
import { EmptyPlaceholder } from '@/components/empty-placeholder';
import { Button } from '@/components/ui/button';
import { getCurrentUser } from '@/actions/userActions';
import Loader from '@/components/Loading';
import Navbar from '@/components/Navbar';
import { listTeams } from '@/actions/teamActions';

// teams page is public page, not require login
export default async function TeamsPage() {
  const teams = await listTeams();
  const user = await getCurrentUser();

  if (!teams || teams.length === 0) {
    return (
      <>
        <div className="w-full">
          <Suspense fallback={<Loader />}>
            <Navbar changeBg />
          </Suspense>
        </div>
        <div className="felx-1 flex justify-center pt-20">
          <EmptyPlaceholder>
            <EmptyPlaceholder.Icon name="users" />
            <EmptyPlaceholder.Title>
              No Team available yet
            </EmptyPlaceholder.Title>
            <EmptyPlaceholder.Description>
              It is so quiet...
            </EmptyPlaceholder.Description>
            <Button>
              <Link className="link open-button" href="/teams/create-team">
                Create Team Now
              </Link>
            </Button>
          </EmptyPlaceholder>
        </div>
      </>
    );
  }

  console.log(`all teams data`, { teams });

  // if teams are not created by current user, show create team button
  const isOwner = teams.find((t) => t.userId === user?.id);
  return (
    <>
      <div className="w-full">
        <Suspense fallback={<Loader />}>
          <Navbar changeBg />
        </Suspense>
      </div>
      <div className="container m-2 mx-auto md:p-10">
        <div className="page-header">
          <div className="page-title-group">
            <div className="page-title">Find your team to join</div>
            <div className="page-description">
              Must sign in to create or join a team. All team members must have
              a valid race entry and complete the registration process before
              the registration deadline.
            </div>
          </div>
          {/* if current user has no team, show create team button */}
          {!isOwner && (
            <button className="btn btn-primary btn-large blue">
              <Link className="link open-button" href="/teams/create-team">
                Create team
              </Link>
            </button>
          )}
        </div>
        <Suspense fallback={<Loader />}>
          <DisplayTeams teams={teams} ownerId={user?.id} />
        </Suspense>
      </div>
    </>
  );
}

// every 5 minutes will refresh the pages
export const revalidate = 300;

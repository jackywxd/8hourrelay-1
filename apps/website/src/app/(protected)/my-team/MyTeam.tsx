import Link from 'next/link';
import { Button } from '@/components/ui/button';
import TeamForm from './TeamForm';
import { EmptyPlaceholder } from '@/components/empty-placeholder';

function MyTeam({ team }) {
  return (
    <>
      {team ? (
        <TeamForm team={team} />
      ) : (
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
      )}
    </>
  );
}

export default MyTeam;

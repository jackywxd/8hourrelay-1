import './teams.css';

import Link from 'next/link';

import { EmptyPlaceholder } from '@/components/empty-placeholder';
import { Button } from '@/components/ui/button';

export default async function TeamsPage() {
  return (
    <EmptyPlaceholder>
      <EmptyPlaceholder.Icon name="users" />
      <EmptyPlaceholder.Title>No Team available yet</EmptyPlaceholder.Title>
      <EmptyPlaceholder.Description>
        It is so quiet...
      </EmptyPlaceholder.Description>
      <Button>
        <Link className="link open-button" href="/team/create">
          Create Team Now
        </Link>
      </Button>
    </EmptyPlaceholder>
  );
}

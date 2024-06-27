import Link from 'next/link';

import { Badge } from '@/components/ui/badge';
import { AllTeams } from '@8hourrelay/database';

function TeamItem({ team, ownerId }: { team: AllTeams[0]; ownerId: number }) {
  if (!team) {
    return null;
  }

  const { name, race, id, isOpen, slogan, raceId, userId } = team;
  return (
    <div className={`grid-item`}>
      {ownerId === userId && (
        <Link href={`/my-team`}>
          <Badge
            variant="secondary"
            className="round-md absolute hover:bg-muted-foreground"
          >
            My Team
          </Badge>
        </Link>
      )}

      <div className="icon-container">
        <Link href={`/teams/${encodeURIComponent(name)}?raceId=${raceId}`}>
          <img
            src={
              race?.name === 'Open' || race?.name === 'Master'
                ? '/img/icon_adult.svg'
                : '/img/icon_youth.svg'
            }
          />
        </Link>
      </div>
      <div className="team-text-container">
        <div className="team-name">{name}</div>
        <div className="team-description">
          {slogan ? slogan.toUpperCase() : <br />}
        </div>
      </div>
      {isOpen ? (
        <Link href={`/registration?action=join&teamId=${id}`}>
          <button className="btn btn-round btn-small btn-light">Join</button>
        </Link>
      ) : (
        <div className="w-20 rounded-full border bg-red-500 p-1 text-center">
          Closed
        </div>
      )}
    </div>
  );
}

export default TeamItem;

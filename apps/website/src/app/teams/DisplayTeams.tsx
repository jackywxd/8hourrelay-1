import { AllTeams, Team } from '@8hourrelay/database';
import TeamItem from './TeamItem';

function DisplayTeams({
  teams,
  ownerId,
}: {
  teams: AllTeams;
  ownerId: number;
}) {
  if (!teams) {
    return null;
  }

  return (
    <div className="teams">
      <div className="grid">
        {teams.map((team) => {
          return <TeamItem key={team.id} team={team} ownerId={ownerId} />;
        })}
      </div>
    </div>
  );
}

export default DisplayTeams;

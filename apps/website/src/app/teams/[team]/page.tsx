import { redirect } from 'next/navigation';

import ShowTeam from './ShowTeam';
import { queryTeamName } from '@/actions';

export default async function TeamPage({ params, searchParams }: PageProps) {
  const teamName = params.team;

  // we should have team name and race id
  if (!teamName) {
    redirect('/teams');
  }
  const team = await queryTeamName(decodeURIComponent(teamName));

  if (!team) {
    redirect('/teams');
  }

  console.log(`team: ${team}`, team);

  return (
    <div className="container mx-auto mt-10 p-3">
      <ShowTeam team={team} />
    </div>
  );
}

export const revalidate = 300;

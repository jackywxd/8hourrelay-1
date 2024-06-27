import { redirect } from 'next/navigation';

import { listTeams, queryTeamName } from '@/actions/teamActions';
import ShowTeam from './ShowTeam';

interface PageProps {
  params: {
    team: string;
  };
}

export async function generateStaticParams(): Promise<any> {
  const teams = await listTeams();

  return teams?.map((team) => ({
    team: team.name,
  }));
}

export async function generateMetadata({ params }: PageProps) {
  const teamName = params.team; // team name

  if (!teamName) {
    return {};
  }

  const team = await queryTeamName(teamName);
  if (!team) {
    return {};
  }

  const url = process.env.NEXT_PUBLIC_HOST_NAME;

  const ogUrl = new URL(`${url}api/og`);
  ogUrl.searchParams.set('heading', team.name);
  ogUrl.searchParams.set('slogan', team?.slogan || '');
  ogUrl.searchParams.set('type', 'website');
  ogUrl.searchParams.set('mode', 'dark');

  const title = `8 Hour Relay/Team ${team.name}`;
  const description = `Join team ${team.name} for the 8 hour relay`;
  return {
    title: `8 Hour Relay/Team ${team.name}`,
    description: `Join team ${team.name} for the 8 hour relay`,
    openGraph: {
      title,
      description,
      type: 'website',
      url: `${url}teams/${team.name}`,
      images: [
        {
          url: ogUrl.toString(),
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogUrl.toString()],
    },
  };
}

export default async function TeamPage({ params }: PageProps) {
  const teamName = params.team;
  if (!teamName) {
    redirect('/teams');
  }
  const team = await queryTeamName(teamName);

  if (!team) {
    redirect('/teams');
  }
  return (
    <div className="container mx-auto mt-20 p-3">
      <ShowTeam team={team} />
    </div>
  );
}

export const revalidate = 300;

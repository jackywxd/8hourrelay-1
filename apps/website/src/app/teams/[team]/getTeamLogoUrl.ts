export function getTeamLogoUrl(team: any) {
  const url = process.env.NEXT_PUBLIC_HOST_NAME;

  const ogUrl = new URL(`${url}api/og`);
  ogUrl.searchParams.set('heading', team.name);
  ogUrl.searchParams.set('slogan', team.slogan);
  ogUrl.searchParams.set('type', 'website');
  ogUrl.searchParams.set('mode', 'dark');

  return ogUrl.toString();
}

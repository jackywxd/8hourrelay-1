'use client';

import { CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { capitalize } from '@/lib/utils';
import { AllTeams, RaceEntryRoster } from '@8hourrelay/database';

import { EditRoster } from './EditRoster';
import { SelectTeam } from './SelectTeam';

export function EditTeamRoster({
  teams,
  roster,
}: {
  teams: AllTeams;
  roster: RaceEntryRoster;
}) {
  return (
    <div className="container mx-auto mt-3 h-full max-w-[800px]">
      <CardHeader>
        <CardTitle>
          Name:{' '}
          {capitalize(
            roster?.raceEntry.preferName ??
              `${roster?.raceEntry.firstName} ${roster?.raceEntry.lastName}`
          )}
        </CardTitle>
        <CardDescription>Email: {roster?.raceEntry.email}</CardDescription>
        <CardTitle>Bib#: {roster?.bib ?? 'N/A'}</CardTitle>
      </CardHeader>

      <Tabs defaultValue="edit" className="w-full">
        <TabsList className="w-full">
          <TabsTrigger value="edit" className="w-full">
            Edit
          </TabsTrigger>
          <TabsTrigger value="transfer" className="w-full">
            Transfer
          </TabsTrigger>
        </TabsList>
        <TabsContent value="edit">
          <EditRoster roster={roster} />
        </TabsContent>
        <TabsContent value="transfer">
          <SelectTeam teams={teams} roster={roster} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

'use client';

import Link from 'next/link';
import { useMemo } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { FaRegFaceFrown, FaRegFaceSmile } from 'react-icons/fa6';

import { IUserTeam } from '@/actions/userActions';
import { EmptyPlaceholder } from '@/components/empty-placeholder';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from '@/components/ui/card';
import { capitalize } from '@/lib/utils';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useMediaQuery } from '@/components/useMediaQuery';
import { RaceEntriesList } from './RaceEntriesList';
import { RaceEntriesTable } from './RaceEntriesTable';

function MyRacePage({ team }: { team: IUserTeam }) {
  const isMobile = useMediaQuery(`(max-width: 768px)`);
  console.log('isMobile', isMobile);
  if (!team?.race || !team?.raceEntries || !team?.raceEntriesToTeams) {
    return null;
  }
  let { totalTeamMembers, totalFemaleTeamMembers, totalMinutes, isTeamValid } =
    useMemo(() => {
      let isValid = false;
      const totalTeamMembers = team.raceEntries?.length;
      const totalMinutes = team.raceEntriesToTeams.reduce((total, entry) => {
        return total + (entry?.raceDuration ? entry?.raceDuration : 0);
      }, 0);
      const totalFemaleTeamMembers = team.raceEntries?.filter(
        (entry) => entry?.gender === 'Female'
      ).length;

      if (team.race.maxTeamSize) {
        if (team.race.isCompetitive && team.race.minFemale) {
          if (
            team.race.maxTeamSize === totalTeamMembers &&
            team.race.minFemale <= totalFemaleTeamMembers &&
            totalMinutes === 480
          ) {
            isValid = true;
          }
        } else if (
          team.race.maxTeamSize >= totalTeamMembers &&
          totalMinutes === 480
        ) {
          isValid = true;
        }
      }
      return {
        totalTeamMembers,
        totalFemaleTeamMembers,
        totalMinutes,
        isTeamValid: isValid,
      };
    }, [team, team.race, team.raceEntries, team.raceEntriesToTeams]);

  return (
    <ErrorBoundary fallback={<div>Something went wrong</div>}>
      <div className="flex flex-col">
        {team ? (
          <Card>
            <CardHeader className="flex flex-col items-center gap-5 md:flex-row">
              <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
                <Avatar className="h-12 w-12 mix-blend-difference">
                  <AvatarImage
                    src={
                      team?.race?.name === 'Master' ||
                      team?.race?.name === 'Open'
                        ? '/img/icon_adult.svg'
                        : '/img/icon_youth.svg'
                    }
                    alt="Avatar"
                  />
                  <AvatarFallback>{capitalize(team?.name)}</AvatarFallback>
                </Avatar>
                <h3 className="text-lg font-medium">
                  Race: {capitalize(team?.race?.name)}
                </h3>
              </div>

              <div className="flex flex-col md:flex-row md:gap-5">
                <CardDescription>
                  Total Members: {totalTeamMembers}
                </CardDescription>
                <CardDescription>
                  Female: {totalFemaleTeamMembers}
                </CardDescription>
                <CardDescription>
                  Allocated Minutes: {totalMinutes}
                </CardDescription>
              </div>
              {!isTeamValid ? (
                <FaRegFaceFrown size={32} color="red" />
              ) : (
                <FaRegFaceSmile size={32} color="green" />
              )}
            </CardHeader>
            {/* <h3 className="text-center text-lg font-medium">Race Roster</h3> */}
            <CardContent>
              {isMobile ? (
                <RaceEntriesList
                  race={team?.race}
                  raceEntries={team?.raceEntries}
                  roster={team?.raceEntriesToTeams}
                />
              ) : (
                <Tabs defaultValue="table" className="w-full">
                  <TabsList className="w-full">
                    <TabsTrigger value="table" className="w-full">
                      Table
                    </TabsTrigger>
                    <TabsTrigger value="list" className="w-full">
                      List
                    </TabsTrigger>
                  </TabsList>
                  <TabsContent value="list">
                    <RaceEntriesList
                      race={team?.race}
                      raceEntries={team?.raceEntries}
                      roster={team?.raceEntriesToTeams}
                    />
                  </TabsContent>
                  <TabsContent value="table">
                    <RaceEntriesTable
                      race={team?.race}
                      raceEntries={team?.raceEntries}
                      roster={team?.raceEntriesToTeams}
                    />
                  </TabsContent>
                </Tabs>
              )}
            </CardContent>
          </Card>
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
      </div>
    </ErrorBoundary>
  );
}

export default MyRacePage;

'use client';
import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { set, z } from 'zod';

import { FormSkeleton } from '@/components/FormSkeleton';
import { DashboardHeader } from '@/components/header';
import { Icons } from '@/components/icons';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Command, CommandGroup, CommandItem } from '@/components/ui/command';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';

import { ScrollArea } from '@/components/ui/scroll-area';
import { capitalize, cn } from '@/lib/utils';
import { getDirtyFields } from '@/lib/utils/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { updateEntryRoster } from '@/actions';
import { RaceEntryRoster, AllTeams } from '@8hourrelay/database';
import { RaceEntriesTable } from '@/app/(protected)/my-team/RaceEntriesTable';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { SelectTeam } from './SelectTeam';
import { EditRoster } from './EditRoster';

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

'use client';
import { ChevronRight, CircleCheck } from 'lucide-react';
import { useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as z from 'zod';

import { isValidTeamPassword, transferUserTeam } from '@/actions';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { capitalize, cn } from '@/lib/utils';
import { AllTeams, RaceEntryRoster, Team } from '@8hourrelay/database';
import { Input, Radio, RadioGroup } from '@headlessui/react';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
} from './ui/card';
import { Button } from './ui/button';
import { Icons } from './icons';
import { useFormState } from 'react-dom';
import { useRouter } from 'next/navigation';

export function SelectTeam({
  teams,
  roster,
}: {
  teams: AllTeams;
  roster: RaceEntryRoster;
}) {
  const router = useRouter();
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  const [pending, startTransition] = useTransition();
  // Doesn't make sense to transfer to the same team
  const filteredTeams = teams.filter((team) => team.id !== roster?.teamId);
  const passwordFormSchema = z.object({
    password: z
      .string()
      .min(1, { message: 'Password is required' })
      .refine(
        async (value) => {
          console.log('password', value);
          if (!value || !selectedTeam) {
            return;
          }
          const isValid = await isValidTeamPassword(selectedTeam.id, value);
          if (!isValid) {
            return false;
          }
          return true;
        },
        { message: 'Invalid password!' }
      ),
  });
  const form = useForm({
    resolver: zodResolver(passwordFormSchema),
    defaultValues: {
      password: '',
    },
  });

  function onSubmit() {
    startTransition(async () => {
      console.log('form submitted selected', selectedTeam);
      try {
        if (selectedTeam) {
          await transferUserTeam(roster?.id, roster?.teamId, selectedTeam.id);
          toast.info('Transferred user to the new team');
          router.refresh();
          router.back();
        }
      } catch (error) {
        console.log(`error`, error);
        toast.error('Error transferring user to the new team');
      }
    });
  }

  return (
    <div className="container mx-auto mt-3 max-w-[800px]">
      <Card>
        <CardHeader>
          <CardDescription>
            Select the team to transfer and enter the team password. Once done,
            the team member will be transferred to the new team.
          </CardDescription>
        </CardHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <CardContent>
              <RadioGroup
                value={selectedTeam}
                onChange={setSelectedTeam}
                aria-label="Select team"
                className="space-y-2"
              >
                {filteredTeams?.map((currentTeam) => (
                  <div key={currentTeam.id}>
                    <Radio
                      disabled={currentTeam.isOpen ? false : true}
                      value={currentTeam}
                      className={({ checked }) =>
                        cn(
                          // checked ? 'bg-indigo-400' : '',
                          'group relative block cursor-pointer rounded-lg border px-6 py-4 shadow-sm hover:bg-accent hover:text-accent-foreground focus:outline-none aria-checked:border-indigo-500 aria-checked:ring-1 aria-checked:ring-indigo-500 aria-checked:ring-offset-1 sm:flex sm:justify-between'
                        )
                      }
                    >
                      {({ checked }) => (
                        <div className="flex flex-grow items-center justify-between text-start">
                          <div className="text-sm/6">
                            <p className="font-semibold">
                              <strong>{capitalize(currentTeam.name)}</strong>
                              {currentTeam.isOpen ? '' : ' (Closed)'}
                            </p>
                            <div className="xm:flex-col gap-2 md:flex"></div>
                          </div>
                          {checked && (
                            <CircleCheck className="size-6 opacity-0 transition group-data-[checked]:opacity-100" />
                          )}
                        </div>
                      )}
                    </Radio>
                    {selectedTeam && selectedTeam.id === currentTeam.id && (
                      <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                          <FormItem className="w-full p-2">
                            <FormControl>
                              <Input
                                className="w-full"
                                type="password"
                                placeholder="Team password"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    )}
                  </div>
                ))}
              </RadioGroup>
            </CardContent>
            <CardFooter>
              <Button
                type="submit"
                disabled={!form.formState.isDirty || pending}
              >
                {pending && (
                  <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                )}
                Transfer
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>
    </div>
  );
}

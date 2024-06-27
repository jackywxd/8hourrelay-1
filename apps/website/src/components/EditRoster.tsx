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

import { getDirtyFields } from '@/lib/utils/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { updateEntryRoster } from '@/actions';
import { RaceEntryRoster, AllTeams } from '@8hourrelay/database';

export function EditRoster({ roster }: { roster: RaceEntryRoster }) {
  const form = useForm({
    resolver: zodResolver(
      z.object({
        raceDuration: z
          .number()
          .min(20, { message: 'Must be at least 20 minutes' }),
      })
    ),
    defaultValues: {
      ...roster,
    },
  });

  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function onSubmit(data) {
    startTransition(async () => {
      try {
        console.log(`onSubmit`, data);
        const dirtyFields = getDirtyFields(form.formState.dirtyFields, data);
        console.log(`dirtyFields`, dirtyFields);
        if (Object.keys(dirtyFields).length === 0) {
          console.log(`no dirty fields`);
          return;
        }
        await updateEntryRoster(roster?.id!, dirtyFields);
        toast.success('Team settings updated');
        router.refresh();
        router.back();
      } catch (error) {
        console.log(`error`, error);
        toast.error('Error updating team settings');
      }
    });
  }

  return (
    <Card>
      <CardHeader>
        <CardDescription>
          Change the race time slot for {roster?.raceEntry.preferName}
        </CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="grid gap-4 py-4">
            <CardContent>
              <div className="mt-2 grid gap-2 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="raceDuration"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Duration</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="Time Slot"
                          {...field}
                          {...form.register('raceDuration', {
                            valueAsNumber: true,
                          })}
                        />
                      </FormControl>
                      <FormDescription>
                        Run duration of the runner (20minutes)
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </div>
          <CardFooter>
            <Button
              type="submit"
              disabled={!form.formState.isDirty || isPending}
            >
              {isPending && (
                <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
              )}
              Save changes
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}

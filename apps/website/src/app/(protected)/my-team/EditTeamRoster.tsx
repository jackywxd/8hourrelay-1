'use client';
import { Check, ChevronsUpDown } from 'lucide-react';
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
import { Roster } from '@8hourrelay/database';

export function EditTeamRoster({
  name,
  roster,
}: {
  name: string;
  roster: Roster;
}) {
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
  const [isOpen, setIsOpen] = useState(false);
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
        await updateEntryRoster(roster.id, dirtyFields);
        toast.success('Team settings updated');
        setIsOpen(false);
        router.refresh();
        // await registerStore.updateRaceEntry(data);
      } catch (error) {
        console.log(`error`, error);
        toast.error('Error updating team settings');
      }
    });
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" onClick={() => setIsOpen(true)}>
          Edit
        </Button>
      </DialogTrigger>
      <DialogContent
        className={'max-h-screen overflow-y-scroll lg:max-w-screen-lg'}
      >
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <ScrollArea className="w-full">
              <DialogHeader>
                <DialogTitle>Team Member: {capitalize(name)}</DialogTitle>
                <DialogDescription>
                  Change roster for team member
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <Card>
                  <CardHeader>
                    {/* <CardTitle>Participant Information</CardTitle>
                    <div className="flex flex-col justify-between md:flex-row md:items-center">
                      <CardDescription className="">
                        Enter the participant information below. If you register
                        for other people or your kids, you must use their
                        personal information
                      </CardDescription>
                    </div> */}
                  </CardHeader>
                  <CardContent>
                    <div className="mt-2 grid gap-2 md:grid-cols-2">
                      {/* <FormField
                        control={form.control}
                        name="bib"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Bib Number</FormLabel>
                            <FormControl>
                              <Input placeholder="Bib" {...field} />
                            </FormControl>
                            <FormDescription>
                              Bib number for the participant
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      /> */}
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
                </Card>
              </div>
              <DialogFooter>
                <Button
                  type="submit"
                  disabled={!form.formState.isDirty || isPending}
                >
                  {isPending && (
                    <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Save changes
                </Button>
              </DialogFooter>
            </ScrollArea>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

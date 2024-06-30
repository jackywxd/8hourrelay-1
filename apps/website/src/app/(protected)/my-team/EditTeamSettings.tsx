'use client';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { RaceEntry, Team } from '@8hourrelay/database';

import { Input } from '@/components/ui/input';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
  Form,
} from '@/components/ui/form';
import { Icons } from '@/components/icons';
import { capitalize, cn } from '@/lib/utils';
import { DashboardHeader } from '@/components/header';
import { Check, ChevronsUpDown } from 'lucide-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Command, CommandGroup, CommandItem } from '@/components/ui/command';
import { Checkbox } from '@/components/ui/checkbox';
import { FormSkeleton } from '@/components/FormSkeleton';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useState, useTransition } from 'react';
import { Switch } from '@/components/ui/switch';
import { useRouter } from 'next/navigation';
import { getDirtyFields } from '@/lib/utils/form';
import { toast } from 'sonner';
import { updateUserTeam } from '@/actions/teamActions';

export function EditTeamSettings({ team }: { team: Team }) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const form = useForm({
    defaultValues: {
      ...team,
    },
  });

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
        await updateUserTeam(dirtyFields);
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
        <Button
          className="mt-5"
          variant="outline"
          onClick={() => setIsOpen(true)}
        >
          Change Settings
        </Button>
      </DialogTrigger>
      <DialogContent
        className={'max-h-screen overflow-y-scroll lg:max-w-screen-lg'}
      >
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <ScrollArea className="w-full">
              <DialogHeader>
                <DialogTitle>Team: {capitalize(team?.name)}</DialogTitle>
                <DialogDescription>Change team settings</DialogDescription>
              </DialogHeader>

              <CardContent>
                <div className="mt-2 grid gap-2">
                  <FormField
                    control={form.control}
                    name="isOpen"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">
                            Open for registration?
                          </FormLabel>
                          <FormDescription>
                            {field.value
                              ? `Open for new members`
                              : `Closed for new members`}
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Team Password</FormLabel>
                        <FormControl>
                          <Input placeholder="Team password" {...field} />
                        </FormControl>
                        <FormDescription>
                          Your team password is required for new members to join
                          your team
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="slogan"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Team Slogan</FormLabel>
                        <FormControl>
                          <Input placeholder="Team password" {...field} />
                        </FormControl>
                        <FormDescription>
                          Your team slogan is displayed on the team page
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
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

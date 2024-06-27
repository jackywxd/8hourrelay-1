'use client';
import { useTransition } from 'react';
import Link from 'next/link';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Switch } from '@/components/ui/switch';
import { Icons } from '@/components/icons';
import { TeamByOwner } from '@8hourrelay/database';
import { capitalize } from '@/lib/utils';
import { deleteUserTeam, updateUserTeam } from '@/actions';

const teamFormSchema = z.object({
  isOpen: z.boolean().default(false).optional(),
  password: z.string().optional(),
  slogan: z.string().optional(),
});

type TeamFormValues = z.infer<typeof teamFormSchema>;

function TeamForm({ team }: { team: TeamByOwner }) {
  const [isPending, startTransition] = useTransition();
  const defaultValues: Partial<TeamFormValues> = {
    isOpen: team?.isOpen ?? false,
    password: team?.password ?? '',
    slogan: team?.slogan ?? '',
  };

  const form = useForm<TeamFormValues>({
    resolver: zodResolver(teamFormSchema),
    defaultValues,
  });

  const onSubmit = async (formData: TeamFormValues) => {
    console.log('onSubmit', formData);
    const { password, slogan, isOpen } = formData;
    const data: TeamFormValues = {};
    const { getFieldState } = form;
    if (getFieldState('password').isDirty) data.password = password;
    if (getFieldState('slogan').isDirty) data.slogan = slogan;
    if (getFieldState('isOpen').isDirty) data.isOpen = isOpen;

    // console.log('data', data);
    if (Object.keys(data).length === 0) return;
    form.reset();
    await updateUserTeam(data);
    toast.success('Team settings updated');
  };

  const onDelete = () => {
    startTransition(async () => {
      try {
        await deleteUserTeam();
      } catch (error) {
        console.log(error);
        toast.error('Failed to delete team');
      }
    });
  };

  if (!team) return null;

  return (
    <>
      <div className="flex gap-3 self-end">
        {team?.state === 'unpaid' ? (
          <Link
            href={`/payment?session=${team?.payment?.sessionId}`}
            target="_blank"
          >
            <Button>Payment</Button>
          </Link>
        ) : (
          <Button>
            {/* {isPending && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />} */}
            Manage Team Members
          </Button>
        )}
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive">Delete Team</Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete your
                team and remove your data.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction asChild>
                <Button
                  disabled={isPending}
                  variant="destructive"
                  onClick={onDelete}
                >
                  {isPending && (
                    <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Delete My Team
                </Button>
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>My Team: {capitalize(team?.name)}</CardTitle>
          <CardDescription>Race: {team?.race?.name}</CardDescription>
          <CardDescription>
            Total Members: {team?.raceEntries?.length}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
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
              <Button
                type="submit"
                // disabled={store.userStore.isLoading ? true : false}
              >
                {isPending && (
                  <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                )}
                Update Team Settings
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </>
  );
}

export default TeamForm;

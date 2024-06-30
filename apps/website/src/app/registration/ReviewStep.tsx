import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

import { createNewRaceEntry } from '@/actions/raceEntryActions';

import StepperFormActions from '@/components/StepFormActions';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

import { useStepper } from '@/components/ui/stepper';
import { capitalize } from '@/lib/utils';
import { Race, RaceEntry, Team } from '@8hourrelay/database';
import { zodResolver } from '@hookform/resolvers/zod';

import { usePostHog } from 'posthog-js/react';
import { useTransition } from 'react';
import { Wavier } from './ShowWavier';

const raceFormSchema = z.object({
  accepted: z.boolean().refine((value) => value === true, {
    message: 'You must accept race wavier',
  }),
});

type RaceFormValues = z.infer<typeof raceFormSchema>;

export default function ReviewStep({
  selectedRace,
  selectedTeam,
  raceEntry,
  onNext,
}: {
  selectedRace: Race<'teams'>;
  selectedTeam: Team;
  raceEntry: RaceEntry;
  onNext: (session?: string) => void;
}) {
  const { nextStep } = useStepper();
  const posthog = usePostHog();
  const [pending, startTransition] = useTransition();
  const form = useForm<RaceFormValues>({
    resolver: zodResolver(raceFormSchema),
    defaultValues: {
      accepted: false,
    },
  });

  function onSubmit(values: RaceFormValues) {
    startTransition(async () => {
      if (pending) return;
      console.log(`Register Form data`, { values });
      try {
        if (!values.accepted) {
          toast.error(`You must accept race wavier`);
          return;
        }
        const session = await createNewRaceEntry(
          raceEntry,
          selectedRace,
          selectedTeam
        );
        posthog.capture('user_created_registration', {
          race: selectedRace.name,
          team_id: selectedTeam.id,
          team_name: selectedTeam.name,
          name: raceEntry.firstName + ' ' + raceEntry.lastName,
          phone: raceEntry.phone,
          email: raceEntry.email,
        });

        toast.success(`Registration created successfully!`);
        onNext(session);
        nextStep();
      } catch (error) {
        toast.error(
          `Error creating registration! Please try again later. ${error}`
        );
      }
    });
  }

  return (
    <div className="container mx-auto w-full text-left">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Review your registration details</CardTitle>
              {selectedRace.isCompetitive && (
                <strong>
                  Note: Entry fee was already paid by team captain.
                </strong>
              )}
              <CardDescription>
                You must read and accept the terms before submitting
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-2 md:grid-cols-2">
                <ul className="mt-2 space-y-1 text-start">
                  <li>
                    <strong>Race Category:</strong> {selectedRace.name}
                  </li>
                  <li>
                    <strong>Team Name:</strong> {capitalize(selectedTeam?.name)}
                  </li>
                  <li>
                    <strong>Entry Fee:</strong> {selectedRace.entryFee}{' '}
                  </li>
                </ul>
                <ul className="mt-2 space-y-1 text-start">
                  <li>
                    <strong>First Name:</strong> {raceEntry.firstName}
                  </li>
                  <li>
                    <strong>Last Name:</strong> {raceEntry.lastName}
                  </li>
                  <li>
                    <strong>Gender:</strong> {raceEntry.gender}
                  </li>
                  <li>
                    <strong>Phone:</strong> {raceEntry.phone}
                  </li>
                  <li>
                    <strong>Shirt Size:</strong> {raceEntry.size}
                  </li>
                </ul>
                <FormField
                  control={form.control}
                  name="accepted"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex flex-row items-center space-x-3 space-y-0 px-2">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={
                              field.onChange as (checked: boolean) => void
                            }
                          />
                        </FormControl>
                        <div className="">
                          <FormLabel>
                            Accept our <Wavier />
                          </FormLabel>
                          <FormDescription>
                            Click above to review the race wavier.
                          </FormDescription>
                        </div>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>
          <StepperFormActions />
        </form>
      </Form>
    </div>
  );
}

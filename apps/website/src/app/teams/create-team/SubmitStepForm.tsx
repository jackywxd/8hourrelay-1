'use client';

import { usePostHog } from 'posthog-js/react';
import { useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { createNewTeam } from '@/actions/teamActions';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Form } from '@/components/ui/form';
import { useStepper } from '@/components/ui/stepper';
import { capitalize } from '@/lib/utils';
import { NewTeam, Race } from '@8hourrelay/database';

import StepperFormActions from '../../../components/StepFormActions';

export default function SubmitStepForm({
  selectedRace,
  team,
  onNext,
}: {
  selectedRace: Race;
  team: NewTeam;
  onNext: (session: string) => void;
}) {
  const [isPending, startTransition] = useTransition();
  const posthog = usePostHog();

  const { nextStep } = useStepper();

  const form = useForm();

  function action() {
    startTransition(async () => {
      if (isPending) return;

      const newTeam: NewTeam = {
        ...team,
        name: team.name.toLowerCase(),
        raceId: selectedRace.id,
      };
      try {
        // session is stripe checkout session for Open teams
        const session = await createNewTeam(newTeam, selectedRace);
        toast.success(`Team ${capitalize(team.name)} created successfully!`);
        console.log(`stripe session`, session);
        // redirect user to Stripe Checkout for payment for Open teams
        posthog.capture('user_created_team', { team_name: team.name });

        if (session) {
          onNext(session.id);
        }
        nextStep();
      } catch (error) {
        toast.error(`Error creating team! Please try again later. ${error}`);
      }
    });
  }

  return (
    <div className="w-full max-w-[600px]">
      <Form {...form}>
        <form action={action}>
          <Card>
            <CardHeader>
              <CardTitle>New Team: {capitalize(team.name)}</CardTitle>
              <CardDescription>
                {selectedRace.isCompetitive
                  ? `Open race teams are required to pay the team entry fee.You will be redirected to payment page after press Finish
                button`
                  : `Review your new team details and submit.`}
              </CardDescription>
              {selectedRace.isCompetitive && (
                <p className="text-sm text-red-500">
                  <strong>Entry Fee Due Now:</strong> $
                  {selectedRace.entryFee * 12} CAD
                </p>
              )}
            </CardHeader>
            <CardContent>
              <ul className="mt-2 space-y-1 text-start">
                <li>
                  <strong>Race Category:</strong> {selectedRace.name}
                </li>
                <li>
                  <strong>Team Name:</strong> {capitalize(team.name)}
                </li>
                <li>
                  <strong>Team Password:</strong> {team.password}
                </li>
                <li>
                  <strong>Slogan:</strong> {team.slogan ? team.slogan : 'N/A'}
                </li>
              </ul>
            </CardContent>
          </Card>
          {/* <StepperFormActions /> */}
          <StepperFormActions />
        </form>
      </Form>
    </div>
  );
}

'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';

import { EmptyPlaceholder } from '@/components/empty-placeholder';
import { Button } from '@/components/ui/button';
import { Step, Stepper, useStepper } from '@/components/ui/stepper';
import { capitalize } from '@/lib/utils';
import { NewTeam, Race } from '@8hourrelay/database';

import SelectRaceStep from '../../../components/SelectRaceStep';
import SetupTeamStepForm from './SetupTeamStepForm';
import SubmitStepForm from './SubmitStepForm';

const year = new Date().getFullYear().toString();

export default function CreateTeamSteps({ races }: { races: Race[] }) {
  const router = useRouter();
  const [selectedRace, setSelectedRace] = useState<Race>(races[0]); // race category for the new team
  const [newTeam, setTeam] = useState<NewTeam>({
    name: '',
    password: '',
    slogan: '',
    isOpen: true,
    year,
    createdAt: new Date(),
  }); // new team data

  // Stripe payment session
  const [session, setSession] = useState('');

  const onSelectedRaceChange = useCallback(
    (race: Race) => {
      console.log('onSelectedRaceChange', race);
      const teamData = { ...newTeam, raceId: race.id };
      setTeam(teamData);
      setSelectedRace(race);
    },
    [selectedRace]
  );

  useEffect(() => {
    if (session) {
      setTimeout(() => {
        router.replace(`/payment?session=${session}`);
      }, 6000);
    }
  }, [session]);

  const steps = [
    {
      label: 'Select race category',
      description: '',
      component: (
        <SelectRaceStep
          races={races}
          selectedRace={selectedRace}
          onNext={onSelectedRaceChange}
        />
      ),
    },
    {
      label: 'Setup team',
      description: '',
      component: <SetupTeamStepForm team={newTeam} setTeam={setTeam} />,
      onNext: () => {},
    },
    {
      label: 'Review',
      description: '',
      component: (
        <SubmitStepForm
          selectedRace={selectedRace}
          team={newTeam}
          onNext={(session: string) => {
            setSession(session);
          }}
        />
      ),
      onNext: () => {},
    },
  ];

  return (
    <div className="mt-3 flex w-full flex-1 flex-col items-center gap-4">
      <Stepper variant="circle-alt" initialStep={0} steps={steps}>
        {steps.map((stepProps, index) => {
          return (
            <Step
              key={stepProps.label}
              {...stepProps}
              className="flex w-full flex-1"
            >
              {stepProps.component}
            </Step>
          );
        })}
        <MyStepperFooter newTeam={newTeam} session={session} />
      </Stepper>
    </div>
  );
}

function MyStepperFooter({
  newTeam,
  session,
}: {
  newTeam: NewTeam;
  session: string;
}) {
  const { activeStep, steps } = useStepper();

  if (activeStep !== steps.length) {
    return null;
  }

  if (session) {
    return (
      <div className="mt-10 flex h-full w-full flex-col items-center">
        <EmptyPlaceholder>
          <EmptyPlaceholder.Icon name="check" className="text-green-500" />
          <EmptyPlaceholder.Title>
            Congratulations! Your team {capitalize(newTeam?.name)} is created
            successfully. Will redirect to payment page in 5 seconds... Or you
            can press the Payment button below.
          </EmptyPlaceholder.Title>
          <EmptyPlaceholder.Description></EmptyPlaceholder.Description>
          <Link href={`/payment?session=${session}`} target="_blank">
            <Button className="w-full">Payment</Button>
          </Link>
        </EmptyPlaceholder>
      </div>
    );
  }

  return (
    <div className="mt-10 flex h-full w-full flex-col items-center">
      <EmptyPlaceholder>
        <EmptyPlaceholder.Icon name="check" className="text-green-500" />
        <EmptyPlaceholder.Title>
          Congratulations! Your team {capitalize(newTeam?.name)} is created
          successfully. Invite your team members to join now.
        </EmptyPlaceholder.Title>
        <EmptyPlaceholder.Description></EmptyPlaceholder.Description>
        <div className="flex gap-5">
          <Link href="/my-team">
            <Button className="w-full">My Team</Button>
          </Link>
          <Link href="/teams/invite-team-members">
            <Button className="w-full" variant="default">
              Invite Team Members
            </Button>
          </Link>
        </div>
      </EmptyPlaceholder>
    </div>
  );
}

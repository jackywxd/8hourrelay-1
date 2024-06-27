'use client';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';

import SelectRaceStep from '@/components/SelectRaceStep';
import { Step, Stepper, useStepper } from '@/components/ui/stepper';
import { NewRaceEntry, Race, Team } from '@8hourrelay/database';

import EmergencyContactStep from './EmergencyContactStep';
import PaymentStep from './PaymentStep';
import PersonalFormStep from './PersonalFormStep';
import ReviewStep from './ReviewStep';
import SelectTeamStep from './SelectTeamStep';

export default function RegistrationSteps({
  races,
  team,
}: {
  races: Race<'teams'>[];
  team?: Team;
}) {
  const router = useRouter();
  // Stripe payment session
  const [session, setSession] = useState('');

  const [selectedRace, setSelectedRace] = useState<Race<'teams'>>(() => {
    if (team) {
      return races.find((r) => r.id === team.raceId);
    }
    return races[0];
  });
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(
    team ? team : null
  ); // no team selected
  const [emergencyContact, setEmergencyContact] = useState({
    emergencyName: '',
    emergencyPhone: '',
  });
  const [raceEntry, setRaceEntry] = useState<Partial<NewRaceEntry>>({
    year: new Date().getFullYear().toString(),
    firstName: '',
    lastName: '',
    preferName: '',
  });

  const onSelectedTeam = useCallback((t: Team) => {
    console.log('selected team', t);
    setSelectedTeam(t);
    const race = { ...raceEntry, teamId: t.id };
    setRaceEntry(race);
  }, []);

  console.log(`selected race`, selectedRace);
  console.log(`selected team`, selectedTeam);

  useEffect(() => {
    if (session) {
      setTimeout(() => {
        router.replace(`/payment?session=${session}`);
      }, 6000);
    }
  }, [session]);

  const steps = [
    {
      label: 'Select Race Category',
      description: '',
      component: (
        <SelectRaceStep
          selectedRace={selectedRace}
          races={races}
          onNext={(race) => setSelectedRace(race)}
        />
      ),
    },
    {
      label: 'Select team',
      description: 'Team password is required to register for a team',
      component: (
        <SelectTeamStep
          team={selectedTeam}
          onNext={onSelectedTeam}
          selectedRace={selectedRace}
        />
      ),
    },
    {
      label: 'Personal Information',
      description: '',
      component: (
        <PersonalFormStep
          raceEntry={raceEntry}
          onNext={(data) => setRaceEntry(data)}
        />
      ),
    },
    {
      label: 'Emergency Contact',
      description: '',
      component: (
        <EmergencyContactStep
          emergencyContact={emergencyContact}
          onNext={(data) => {
            setRaceEntry({ ...raceEntry, ...data });
            setEmergencyContact(data);
          }}
        />
      ),
    },
    {
      label: 'Review',
      description: '',
      component: (
        <ReviewStep
          selectedRace={selectedRace}
          selectedTeam={selectedTeam}
          raceEntry={raceEntry}
          onNext={(session?: string) => {
            if (session) setSession(session);
            setRaceEntry({ ...raceEntry, ...emergencyContact, accepted: true });
          }}
        />
      ),
    },
  ];

  return (
    <div className="mt-3 flex h-full flex-1 flex-col items-center gap-4">
      <Stepper variant="circle-alt" initialStep={team ? 1 : 0} steps={steps}>
        {steps.map((stepProps) => {
          return (
            <Step key={stepProps.label} {...stepProps}>
              {stepProps.component}
            </Step>
          );
        })}
        <PaymentStep session={session} />
      </Stepper>
    </div>
  );
}

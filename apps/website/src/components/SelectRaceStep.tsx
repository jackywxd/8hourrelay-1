'use client';

import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Form } from '@/components/ui/form';

import { Radio, RadioGroup } from '@headlessui/react';
import { useStepper } from '@/components/ui/stepper';
import { Race } from '@8hourrelay/database';
import { CircleCheck } from 'lucide-react';

import StepperFormActions from './StepFormActions';
import { Card, CardContent, CardFooter, CardHeader } from './ui/card';

const FormSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
});
type FormSchemaType = z.infer<typeof FormSchema>;

export default function SelectRaceStep({
  races,
  selectedRace,
  onNext,
}: {
  races: Race<'teams'>[];
  selectedRace: Race<'teams'>;
  onNext: (race: Race<'teams'>) => void;
}) {
  const [selected, setSelected] = useState<Race>(selectedRace || races[0]);
  const { nextStep } = useStepper();
  const form = useForm();
  function onSubmit() {
    console.log('form submitted selected', selected);
    onNext(selected);
    nextStep();
  }

  return (
    <div className="container mx-auto mt-3 max-w-[800px]">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="">
          <RadioGroup
            by="description"
            value={selected}
            onChange={setSelected}
            aria-label="Race category"
            className="space-y-2"
          >
            {races.map((race) => (
              <Radio
                key={race.id}
                value={race}
                className="group relative flex cursor-pointer rounded-lg bg-muted px-5 py-4 shadow-md transition hover:bg-popover hover:text-popover-foreground focus:outline-none aria-checked:border-indigo-500 aria-checked:ring-1 aria-checked:ring-indigo-500 aria-checked:ring-offset-1"
              >
                <div className="flex w-full items-center justify-between text-start">
                  <div className="text-sm/6">
                    <p className="font-semibold">
                      <strong>{race.name}</strong> - {race.description} -{' '}
                      {race.teams?.length || 0} team(s)
                    </p>
                    <div className="xm:flex-col gap-2 md:flex">
                      <div>Entry Fee: {race.entryFee}</div>
                      <div aria-hidden="true" className="hidden md:block">
                        &middot;
                      </div>
                      {race.maxTeamSize && (
                        <div>Max Team Size: {race.maxTeamSize}</div>
                      )}
                      <div aria-hidden="true" className="hidden md:block">
                        &middot;
                      </div>
                      {race.minFemale && (
                        <div>Minimum Female Members: {race.minFemale}</div>
                      )}
                    </div>
                  </div>
                  <CircleCheck className="size-6 opacity-0 transition group-data-[checked]:opacity-100" />
                </div>
              </Radio>
            ))}
          </RadioGroup>
          <StepperFormActions />
        </form>
      </Form>
    </div>
  );
}

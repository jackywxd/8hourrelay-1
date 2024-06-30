import { CircleCheck } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as z from 'zod';

import { isValidTeamPassword } from '@/actions/teamActions';
import StepperFormActions from '@/components/StepFormActions';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { useStepper } from '@/components/ui/stepper';
import { capitalize, cn } from '@/lib/utils';
import { Race, Team } from '@8hourrelay/database';
import { Input, Radio, RadioGroup } from '@headlessui/react';
import { zodResolver } from '@hookform/resolvers/zod';

export default function SelectTeamStep({
  team,
  selectedRace,
  onNext,
}: {
  team: Team | null;
  onNext: (t: Team) => void;
  selectedRace: Race<'teams'>;
}) {
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(
    team ? team : null
  );

  const passwordFormSchema = z.object({
    password: z
      .string()
      .min(1, { message: 'Password is required' })
      .refine(
        async (value) => {
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
  const { nextStep } = useStepper();
  console.log(`selectedRace `, selectedRace);
  function onSubmit(formData: any) {
    console.log('form submitted selected', selectedTeam, formData);
    if (!selectedTeam) {
      toast.error('Please select a team');
      return;
    }
    onNext(selectedTeam);
    nextStep();
  }

  //   console.log(`selectIndex`, selectIndex);

  return (
    <div className="container mx-auto mt-3 max-w-[800px]">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {selectedRace?.teams?.length > 0 ? (
            <RadioGroup
              value={selectedTeam}
              onChange={setSelectedTeam}
              aria-label="Select team"
              className="space-y-2"
            >
              {selectedRace?.teams?.map((currentTeam) => (
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
          ) : (
            <div className="text-center font-medium group-data-[hover]:text-zinc-500 md:text-lg">
              No teams available
            </div>
          )}
          <StepperFormActions />
        </form>
      </Form>
    </div>
  );
}

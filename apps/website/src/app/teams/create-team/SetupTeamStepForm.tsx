'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

import { queryTeamName } from '@/actions/teamActions';
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
import { useStepper } from '@/components/ui/stepper';
import { NewTeam } from '@8hourrelay/database';

import StepperFormActions from '../../../components/StepFormActions';

export default function SetupTeamForm({
  team,
  setTeam,
}: {
  team: Pick<
    NewTeam,
    'name' | 'password' | 'slogan' | 'isOpen' | 'year' | 'createdAt'
  >;
  setTeam: (
    team: Pick<
      NewTeam,
      'name' | 'password' | 'slogan' | 'isOpen' | 'year' | 'createdAt'
    >
  ) => void;
}) {
  const { nextStep } = useStepper();

  const teamFormSchema = z.object({
    name: z
      .string()
      .min(1, { message: 'Name is required' })
      .refine(
        async (value) => {
          const teamName = await queryTeamName(value.toLowerCase());
          console.log('teamName', value, teamName);
          if (teamName) {
            return false;
          }
          return true;
        },
        { message: 'This name already in use' }
      ),
    password: z.string().min(1, { message: 'Password is required' }),
    slogan: z.string().optional(),
  });
  const form = useForm<NewTeam>({
    resolver: async (data, context, options) => {
      // you can debug your validation schema here
      console.log('formData', data);
      console.log(
        'validation result',
        await zodResolver(teamFormSchema)(data, context, options)
      );
      return zodResolver(teamFormSchema)(data, context, options);
    },
    defaultValues: team,
    shouldFocusError: true,
  });

  function onSubmit(data: NewTeam) {
    setTeam(data);
    form.reset();
    nextStep();
  }

  return (
    <div className="item-center flex w-full max-w-[600px] justify-center">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full space-y-3 text-start"
        >
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Team Name*</FormLabel>
                <FormControl>
                  <Input type="text" {...field} />
                </FormControl>
                <FormDescription>
                  This is the name of your team.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Team Password*</FormLabel>
                <FormControl>
                  <Input type="password" {...field} />
                </FormControl>
                <FormDescription>
                  This is the password to join the team.
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
                <FormLabel>Slogan</FormLabel>
                <FormControl>
                  <Input type="text" {...field} />
                </FormControl>
                <FormDescription>Slogan of your team.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <StepperFormActions />
        </form>
      </Form>
    </div>
  );
}

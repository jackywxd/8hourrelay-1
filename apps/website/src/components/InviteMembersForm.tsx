'use client';

import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, useFieldArray } from 'react-hook-form';
import * as z from 'zod';
import { toast } from 'sonner';

import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Trash2Icon, PlusCircleIcon } from 'lucide-react';

import { Race, NewEmailInvitation } from '@8hourrelay/database';

const inviteFormSchema = z
  .object({
    members: z
      .array(
        z
          .object({
            email: z.string().email({ message: 'Invalid email' }),
            gender: z.enum(['Male', 'Female']),
          })
          .optional(),
      )
      .optional(),
  })
  .optional();

export default function InviteMembersForm({
  selectedRace,
  members,
  setMembers,
}: {
  selectedRace: Race;
  members: NewEmailInvitation[];
  setMembers: (raceEntry: NewEmailInvitation[]) => void;
}) {
  const form = useForm({
    resolver: zodResolver(inviteFormSchema),
    defaultValues: {
      members: members
        ? members
        : [
            {
              email: '',
              gender: 'Male',
            },
          ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control, // control props comes from useForm (optional: if you are using FormContext)
    name: 'members', // unique name for your Field Array
    rules: {
      validate: (data) => {
        console.log(`filedArray validation`, data);
        return true;
      },
    },
  });

  // data comes from hook formNewEmailInvitation[])
  function onSubmit(data: any) {
    console.log('form submitted', data);

    if (
      selectedRace &&
      selectedRace.maxTeamSize &&
      data.members &&
      data.members.length > selectedRace.maxTeamSize
    ) {
      toast.error('Maximum of members allowed');
    }
    // setMembers(data.members);
    form.reset();
    nextStep();
    toast.info('Team data submitted!');
  }
  return (
    <div className="flex flex-col space-y-5">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="text-start space-y-3 mb-5"
        >
          {fields.map((field, index) => (
            <section
              key={field.id}
              className="flex flex-col gap-1 md:flex-row md:items-center md:justify-between"
            >
              <FormField
                control={form.control}
                name={`members.${index}.email`}
                render={({ field }) => (
                  <FormItem className="md:w-1/2">
                    <FormLabel>Member {index + 1}</FormLabel>
                    <FormControl>
                      <Input placeholder="Email" type="email" {...field} />
                    </FormControl>
                    <FormDescription>Team member email address</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name={`members.${index}.gender`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Gender</FormLabel>
                    <Select {...field}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Gender" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {['Male', 'Female'].map((r) => (
                          <SelectItem key={r} value={r}>
                            {r}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription>Gender of the member</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Trash2Icon
                className="mr-2 h-4 w-4 md:h-6 md:w-6 hover:text-red-500 cursor-pointer"
                onClick={() => remove(index)}
              />
            </section>
          ))}
        </form>
      </Form>
      <div className="flex justify-end">
        <Button
          size="sm"
          disabled={
            selectedRace?.maxTeamSize &&
            fields.length >= selectedRace.maxTeamSize
              ? true
              : false
          }
          onClick={() => append({ email: '', gender: 'Male' })}
        >
          <PlusCircleIcon className="mr-2 h-4 w-4" />
          Add Member
        </Button>
      </div>
    </div>
  );
}

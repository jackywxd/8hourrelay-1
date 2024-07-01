'use client';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

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
import { Input } from '@/components/ui/input';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useStepper } from '@/components/ui/stepper';
import { RaceEntry, sizeEnum } from '@8hourrelay/database/db/modelTypes';
import { zodResolver } from '@hookform/resolvers/zod';

import { isDuplicatedEntry } from '@/actions/raceEntryActions';
import { ShowSizeChart } from './ShowShirtSizeChart';

const shirtSizeOptions = sizeEnum.map((m) => ({
  value: m,
  label: m,
}));

export const raceFormSchema = z
  .object({
    isForOther: z.boolean().default(false),
    firstName: z.string().min(1, { message: 'First name is required' }),
    lastName: z.string().min(1, { message: 'Last name is required' }),
    preferName: z.string().nullable().optional(),
    phone: z.string().min(1, { message: 'Phone number is required' }).regex(
      // verify is a valid phone number
      new RegExp(
        `^\\+?\\d{1,4}?[-.\\s]?\\(?\\d{1,3}?\\)?[-.\\s]?\\d{1,4}[-.\\s]?\\d{1,9}$`
      ),
      {
        message: 'Enter a valid phone number',
      }
    ),
    gender: z.enum(['Male', 'Female']),
    birthYear: z
      .string()
      .regex(new RegExp(`^[0-9]{4}$`), { message: 'Enter 4 digits birth year' })
      .length(4, { message: 'Must be 4 digits' }),
    size: z.string().min(1, { message: 'Select your shirt size' }),
    wechatId: z.string().nullable().optional(),
    personalBest: z.string().nullable().optional(),
    isActive: z.boolean().default(true),
  })
  .superRefine(async (data, ctx) => {
    console.log(`refine`, data);
    if (data.firstName && data.lastName && data.gender && data.birthYear) {
      const isDuplicated = await isDuplicatedEntry(data);
      if (isDuplicated) {
        ctx.addIssue({
          path: ['firstName'],
          code: z.ZodIssueCode.custom,
          message: `This name has already been registered`,
        });
        ctx.addIssue({
          path: ['lastName'],
          code: z.ZodIssueCode.custom,
          message: `This name has already been registered`,
        });
      }
    }

    return z.NEVER;
  });

export type RaceFormValues = z.infer<typeof raceFormSchema>;

export default function PersonalFormStep({
  raceEntry,
  onNext,
}: {
  raceEntry: RaceEntry;
  onNext?: (values: RaceFormValues) => void;
}) {
  const { nextStep } = useStepper();

  const form = useForm<RaceFormValues>({
    resolver: zodResolver(raceFormSchema),
    defaultValues: {
      ...raceEntry,
    },
  });

  // if this form is for other people, we need to reset the personal info
  useEffect(() => {
    // only reset values when defaultValues is not for other and it is changed to isForOther
    if (form.getValues().isForOther) {
      console.log(`register for other people!!`);
      const { setValue, getFieldState } = form;
      getFieldState('firstName').isDirty && setValue('firstName', '');
      getFieldState('lastName').isDirty && setValue('lastName', '');
      !getFieldState('preferName').isDirty && setValue('preferName', '');
      !getFieldState('phone').isDirty && setValue('phone', '');
      !getFieldState('birthYear').isDirty && setValue('birthYear', '');
      !getFieldState('wechatId').isDirty && setValue('wechatId', '');
      !getFieldState('personalBest').isDirty && setValue('personalBest', '');
    }
  }, [form.watch('isForOther')]);

  const onSubmit = async (data: RaceFormValues) => {
    console.log(`Register Form data`, data);
    onNext && onNext(data);
    onNext && nextStep();
  };

  console.log(`form values`, {
    values: form.getValues(),
    error: form.formState.errors,
  });

  return (
    <div className="container mx-auto w-full text-left">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Participant Information</CardTitle>
              <div className="flex flex-col justify-between md:flex-row md:items-center">
                <CardDescription className="">
                  Enter the participant information below. If you register for
                  other people or your kids, you must use their personal
                  information
                </CardDescription>

                <FormField
                  control={form.control}
                  name="isForOther"
                  render={({ field }) => (
                    <FormItem className="flex items-center space-x-3 space-y-0 px-2">
                      <FormControl>
                        <Checkbox
                          className="items-center"
                          checked={field.value}
                          onCheckedChange={
                            field.onChange as (checked: boolean) => void
                          }
                        />
                      </FormControl>
                      <div className="div">
                        <FormLabel>Register for other people</FormLabel>
                      </div>
                    </FormItem>
                  )}
                />
              </div>
            </CardHeader>
            <CardContent>
              {/* <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Participant Email</FormLabel>
                      <FormControl>
                        <Input placeholder="Email" {...field} />
                      </FormControl>
                      <FormDescription>
                        Email for the participant
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                /> */}
              <div className="mt-2 grid gap-2 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>First name</FormLabel>
                      <FormControl>
                        <Input placeholder="First Name" {...field} />
                      </FormControl>
                      <FormDescription>
                        Participant first name as it appears on the government
                        issued ID
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="lastName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Last name</FormLabel>
                      <FormControl>
                        <Input placeholder="Last Name" {...field} />
                      </FormControl>
                      <FormDescription>
                        Participant last name as it appears on the government
                        issued ID
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="gender"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Gender</FormLabel>
                      <Select
                        onValueChange={
                          field.onChange as (value: string) => void
                        }
                        defaultValue={field.value}
                      >
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
                      <FormDescription>
                        Gender of the participant
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="preferName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Prefer name</FormLabel>
                      <FormControl>
                        <Input placeholder="Prefer Name" {...field} />
                      </FormControl>
                      <FormDescription>
                        Set the prefer name or nick name for the participant
                        (Optional)
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone number</FormLabel>
                      <FormControl>
                        <Input placeholder="Phone number" {...field} />
                      </FormControl>
                      <FormDescription>
                        Participant mobile number
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="birthYear"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Year of birth</FormLabel>
                      <FormControl>
                        <Input placeholder="Year of birth" {...field} />
                      </FormControl>
                      <FormDescription>
                        Participant year of birth
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex items-center justify-between pr-2">
                  <FormField
                    control={form.control}
                    name="size"
                    render={({ field }) => (
                      <FormItem className="mt-2 flex w-1/2 flex-col">
                        <FormLabel>Size</FormLabel>
                        <Select
                          onValueChange={
                            field.onChange as (value: string) => void
                          }
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Size" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {shirtSizeOptions.map((r) => (
                              <SelectItem key={r.label} value={r.value}>
                                {r.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>

                        <FormDescription>
                          Size of shirt for the participant
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <ShowSizeChart />
                </div>
                <FormField
                  control={form.control}
                  name="wechatId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>WeChat ID</FormLabel>
                      <FormControl>
                        <Input placeholder="WeChat ID" {...field} />
                      </FormControl>
                      <FormDescription>Optional WeChat ID</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="personalBest"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Personal Best</FormLabel>
                      <FormControl>
                        <Input placeholder="Personal Best" {...field} />
                      </FormControl>
                      <FormDescription>
                        Optional personal best time from the pervious race
                      </FormDescription>
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

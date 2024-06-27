'use client';

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
import { zodResolver } from '@hookform/resolvers/zod';

const raceFormSchema = z
  .object({
    emergencyName: z
      .string()
      .min(1, { message: 'Emergency contact name is required' }),
    emergencyPhone: z
      .string()
      .min(1, { message: 'Phone number is required' })
      .regex(
        // verify is a valid phone number
        new RegExp(
          `^\\+?\\d{1,4}?[-.\\s]?\\(?\\d{1,3}?\\)?[-.\\s]?\\d{1,4}[-.\\s]?\\d{1,9}$`
        ),
        {
          message: 'Enter a valid phone number',
        }
      ),
  })
  .passthrough()
  .superRefine((arg, ctx) => {
    const errors = registerStore.validateForm(arg);
    if (errors.emergencyPhone) {
      ctx.addIssue({
        path: ['emergencyPhone'],
        code: z.ZodIssueCode.custom,
        message: errors.phone,
      });
    }
    return z.NEVER;
  });

type RaceFormValues = z.infer<typeof raceFormSchema>;

type FormData = {
  emergencyName: string;
  emergencyPhone: string;
};
export default function EmergencyContactStep({
  emergencyContact,
  onNext,
}: {
  emergencyContact: FormData;
  onNext: (values: FormData) => void;
}) {
  const { nextStep } = useStepper();

  const form = useForm<RaceFormValues>({
    resolver: zodResolver(raceFormSchema),
    defaultValues: emergencyContact,
  });

  const onSubmit = async (values: FormData) => {
    console.log(`Register Form data`, { values });
    onNext(values);
    nextStep();
  };

  console.log(`form values`, {
    values: form.getValues(),
    error: form.formState.errors,
  });

  return (
    <div className="container mx-auto text-left md:w-[1024px]">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Emergency Contacts</CardTitle>
              <CardDescription></CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-2 md:grid-cols-1">
                <FormField
                  control={form.control}
                  name="emergencyName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Emergency contact name</FormLabel>
                      <FormControl>
                        <Input placeholder="Emergency Name" {...field} />
                      </FormControl>
                      <FormDescription>
                        Emergency contact name will be used to contact in case
                        of emergency
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="emergencyPhone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Emergency contact phone number</FormLabel>
                      <FormControl>
                        <Input placeholder="Emergency Phone" {...field} />
                      </FormControl>
                      <FormDescription>
                        Emergency contact phone number will be used to contact
                        in case of emergency
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

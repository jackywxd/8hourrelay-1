'use client';
import { useRouter } from 'next/navigation';
import { useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

import {
  IUserAllRaceEntries,
  updateUserRaceEntry,
} from '@/actions/raceEntryActions';
import { Icons } from '@/components/icons';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
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
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { getDirtyFields } from '@/lib/utils/form';
import { zodResolver } from '@hookform/resolvers/zod';

import { ShowSizeChart } from './ShowShirtSizeChart';

const shirtSizeOptions = ['S', 'M', 'L', 'XL', '2XL', '3XL', '4XL'].map(
  (m) => ({
    value: m,
    label: m,
  })
);
const raceFormSchema = z.object({
  preferName: z.string().optional().nullable(),
  phone: z.string().min(1, { message: 'Phone number is required' }).regex(
    // verify is a valid phone number
    new RegExp(
      `^\\+?\\d{1,4}?[-.\\s]?\\(?\\d{1,4}?\\)?[-.\\s]?\\d{1,4}[-.\\s]?\\d{1,9}$`
    ),
    {
      message: 'Enter a valid phone number',
    }
  ),
  size: z.string().min(1, { message: 'Select your shirt size' }),
  wechatId: z.string().nullable(),
  personalBest: z.string().nullable(),
  emergencyName: z
    .string()
    .min(1, { message: 'Emergency contact name is required' }),
  emergencyPhone: z
    .string()
    .min(1, { message: 'Phone number is required' })
    .regex(
      // verify is a valid phone number
      new RegExp(
        `^\\+?\\d{1,4}?[-.\\s]?\\(?\\d{1,4}?\\)?[-.\\s]?\\d{1,4}[-.\\s]?\\d{1,9}$`
      ),
      {
        message: 'Enter a valid phone number',
      }
    ),
});

export function EditRaceEntry({
  raceEntry,
}: {
  raceEntry: IUserAllRaceEntries[0];
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const form = useForm({
    resolver: zodResolver(raceFormSchema),
    defaultValues: {
      ...raceEntry,
    },
  });

  function onSubmit(data) {
    startTransition(async () => {
      try {
        console.log(`onSubmit`, data);
        const dirtyFields = getDirtyFields(form.formState.dirtyFields, data);
        console.log(`dirtyFields`, dirtyFields);
        if (Object.keys(dirtyFields).length === 0) {
          console.log(`no dirty fields`);
          return;
        }
        await updateUserRaceEntry(raceEntry.id, dirtyFields);
        toast.success('Updated Race Entry');
        form.reset(data);
        router.refresh();
        router.back();
      } catch (error) {
        console.log(`error`, error);
      }
    });
  }

  if (!raceEntry) {
    return null;
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <ScrollArea className="w-full">
          <CardHeader>
            <CardTitle>Email: {raceEntry.email}</CardTitle>
            <CardTitle>Phone: {raceEntry.phone}</CardTitle>
          </CardHeader>
          <div className="grid gap-4 py-4">
            <Card>
              <CardHeader>
                <CardTitle>Participant Information</CardTitle>
                <div className="flex flex-col justify-between md:flex-row md:items-center">
                  <CardDescription className="">
                    Enter the participant information below. If you register for
                    other people or your kids, you must use their personal
                    information
                  </CardDescription>
                </div>
              </CardHeader>
              <CardContent>
                <div className="mt-2 grid gap-2 md:grid-cols-2">
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
          </div>
          <div className="grid gap-4 py-4">
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
          </div>
          <CardFooter className="gap-5">
            <Button variant="ghost" onClick={() => router.back()}>
              Cancel
            </Button>
            <Button type="submit" disabled={!form.formState.isDirty || pending}>
              {pending && (
                <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
              )}
              Save changes
            </Button>
          </CardFooter>
        </ScrollArea>
      </form>
    </Form>
  );
}

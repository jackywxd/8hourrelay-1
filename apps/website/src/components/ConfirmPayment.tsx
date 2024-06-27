'use client';
import { loadStripe } from '@stripe/stripe-js';
import ShowRaceEntry from './ShowRaceEntry';
import { registerStore } from '@8hourrelay/store';
import { RaceEntry } from '@8hourrelay/models';
import { DashboardHeader } from '@/components/header';
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
} from '@/components/ui/form';
import { Checkbox } from '@/components/ui/checkbox';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Icons } from '@/components/icons';
import { Separator } from '@/components/ui/separator';
import { useRouter } from 'next/navigation';
import { CreateSessionResponse } from '@8hourrelay/store/src/RegistrationStore';
// Make sure to call `loadStripe` outside of a component’s render to avoid
// recreating the `Stripe` object on every render.
const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!,
);

const confirmFormSchema = z.object({
  accepted: z.boolean().refine((v) => v === true, {
    message: 'You must confirm your registration',
  }),
});

type ConfirmFormValues = z.infer<typeof confirmFormSchema>;

function ConfirmForm() {
  const router = useRouter();
  const form = useForm<ConfirmFormValues>({
    resolver: zodResolver(confirmFormSchema),
    defaultValues: { accepted: false },
  });

  const onSubmit = async () => {
    try {
      const [stripe, sessionResponse] = await Promise.all([
        stripePromise,
        registerStore.submitRaceForm(),
      ]);

      // cast sessionResponse to CreateSessionResponse
      const session = sessionResponse as unknown as CreateSessionResponse;
      // redirect user to Stripe Checkout for payment if not free
      if (stripe && session && !session.isFree) {
        stripe.redirectToCheckout({
          sessionId: session.id,
        });
      } else if (session && session.isFree) {
        // redirect user to payment success page if isFree is set
        router.push(`/payment?success=true&session_id=${session.id}`);
      }
    } catch (error) {
      console.log(`error`, error);
    }
  };

  const raceEntry = new RaceEntry(registerStore.form!);

  return (
    <div className="w-full md:w-[800px] container mx-auto">
      <DashboardHeader
        heading="Confirm registration"
        text=" Please review your registration information carefully and accept race polices. Race entry cannot be changed after submitted"
      ></DashboardHeader>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>
                Registered Race: {raceEntry.raceDisplayName}
              </CardTitle>
              <CardTitle>
                Team: {registerStore.getTeamDisplayName(raceEntry.team!)}
              </CardTitle>
              <CardDescription>Entry Fee: {raceEntry.entryFee}</CardDescription>
            </CardHeader>
            <Separator />
            <CardContent>
              <ShowRaceEntry raceEntry={raceEntry} />
            </CardContent>
            <Separator />
            <CardFooter className="mt-5">
              <FormField
                control={form.control}
                name="accepted"
                render={({ field }) => (
                  <FormItem className="flex flex-row space-x-3 space-y-0 items-center">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange as (checked) => void}
                      />
                    </FormControl>
                    <div className="">
                      <FormLabel>Accept below race policies</FormLabel>
                      <FormDescription>
                        Entry fees are non-refundable, non-deferrable, and
                        non-transferable.
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />
            </CardFooter>
          </Card>

          <CardFooter className="grid grid-cols-2 gap-5">
            <Button
              type="submit"
              disabled={
                form.getValues().accepted === false || registerStore.isLoading
                  ? true
                  : false
              }
            >
              {registerStore.isLoading && (
                <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
              )}
              Payment
            </Button>
            <Button
              variant="outline"
              disabled={registerStore.isLoading ? true : false}
              onClick={() => {
                registerStore.setTeamValidated(false);
                registerStore.setState('RE_EDIT');
              }}
            >
              Edit Registration
            </Button>
          </CardFooter>
        </form>
      </Form>
    </div>
  );
}

export default ConfirmForm;

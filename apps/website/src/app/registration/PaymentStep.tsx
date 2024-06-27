'use client';

import Link from 'next/link';

import { EmptyPlaceholder } from '@/components/empty-placeholder';
import { Button } from '@/components/ui/button';
import { useStepper } from '@/components/ui/stepper';

// session is the stripe checkout session
export default function PaymentStep({ session }: { session?: string }) {
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
            Congratulations! Your registration is saved successfully. Will
            redirect to payment page in 5 seconds... Or you can press the
            Payment button below
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
          Congratulations! You are registered successfully.
        </EmptyPlaceholder.Title>
        <EmptyPlaceholder.Description></EmptyPlaceholder.Description>
        <div className="flex gap-5">
          <Link href="/my-team">
            <Button className="w-full">My Team</Button>
          </Link>
          <Link href="/my-registrations">
            <Button className="w-full" variant="default">
              My Registrations
            </Button>
          </Link>
        </div>
      </EmptyPlaceholder>
    </div>
  );
}

import Link from 'next/link';
import { redirect } from 'next/navigation';
import { Suspense } from 'react';

import {
  getPaymentSessionBySessionId,
  updateExpiredPaymentSession,
} from '@/actions/paymentActions';
import { getCurrentUser } from '@/actions/userActions';
import { EmptyPlaceholder } from '@/components/empty-placeholder';
import Loader from '@/components/Loading';
import { Button } from '@/components/ui/button';
import { getValidPaymentSessionBySessionId } from '@8hourrelay/database';

import PaymentPage from './paymentPage';

// handle payment
export default async function Home({
  searchParams,
}: {
  searchParams: {
    session_id: string;
    success: string;
    canceled: string;
    session: string;
  };
}) {
  // redirect from stripe
  const sessionId = searchParams.session_id; // payment succeed
  const success = searchParams.success; // payment succeed
  const canceled = searchParams.canceled; // payment canceled

  // redirect from ourself
  let session = searchParams.session; // checkout session pending for payment

  if (canceled) {
    return (
      <div className="mt-10 flex h-full w-full flex-col items-center">
        <EmptyPlaceholder>
          <EmptyPlaceholder.Icon name="close" className="text-red-500" />
          <EmptyPlaceholder.Title>
            Payment canceled! Return to Home
          </EmptyPlaceholder.Title>
          <EmptyPlaceholder.Description></EmptyPlaceholder.Description>
          <Link href="/">
            <Button className="w-full">Go Home Now</Button>
          </Link>
        </EmptyPlaceholder>
      </div>
    );
  }

  if (success && sessionId) {
    const payment = await getPaymentSessionBySessionId(sessionId);
    console.log(`payment`, payment);
    if (!payment) {
      return (
        <div className="mt-10 flex h-full w-full flex-col items-center">
          <EmptyPlaceholder>
            <EmptyPlaceholder.Icon name="close" className="text-red-500" />
            <EmptyPlaceholder.Title>
              Invalid payment! Please try again later
            </EmptyPlaceholder.Title>
            <EmptyPlaceholder.Description></EmptyPlaceholder.Description>
            <Link href="/">
              <Button className="w-full">Go Home Now</Button>
            </Link>
          </EmptyPlaceholder>
        </div>
      );
    }

    return (
      <div className="mt-10 flex h-full w-full flex-col items-center">
        <EmptyPlaceholder>
          <EmptyPlaceholder.Icon name="trophy" className="text-green-500" />
          <EmptyPlaceholder.Title>Payment successful!</EmptyPlaceholder.Title>
          <EmptyPlaceholder.Description></EmptyPlaceholder.Description>
          <div className="flex w-full justify-between gap-3">
            {payment?.team ? (
              <Link href="/my-team">
                <Button className="w-full">My Team</Button>
              </Link>
            ) : (
              <Link href="/my-registrations">
                <Button className="w-full">My Registrations</Button>
              </Link>
            )}

            <Link href="/account">
              <Button>Account</Button>
            </Link>
          </div>
        </EmptyPlaceholder>
      </div>
    );
  }

  if (session) {
    const user = await getCurrentUser();
    if (!user) redirect('/auth');
    const payment = await getValidPaymentSessionBySessionId(session);
    if (!payment) redirect('/');

    // if payment expired, create new payment session
    if (payment.expiresAt && new Date(payment.expiresAt) < new Date()) {
      console.log(`payment expired, create new payment`);
      session = await updateExpiredPaymentSession(payment.sessionId);
    }
    return (
      <Suspense fallback={<Loader />}>
        <PaymentPage session={session} />
      </Suspense>
    );
  }

  return <div>Payment</div>;
  // redirect('/');
}

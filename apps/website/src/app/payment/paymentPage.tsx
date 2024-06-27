'use client';

import { useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';

import { EmptyPlaceholder } from '@/components/empty-placeholder';
import posthog from 'posthog-js';
import { useAuth } from '@/hooks';

// Make sure to call `loadStripe` outside of a component’s render to avoid
// recreating the `Stripe` object on every render.
const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);

// handle payment
export default function PaymentPage({ session }: { session: string }) {
  const { user } = useAuth();
  useEffect(() => {
    const redirectToStripe = async () => {
      if (session) {
        const stripe = await stripePromise;
        if (stripe) {
          posthog.capture('user_start_payment', {
            user_id: user?.id,
            email: user?.email,
            session_id: session,
          });
          stripe.redirectToCheckout({
            sessionId: session,
          });
        }
      } else {
        posthog.capture('user_payment_failed_without_session', {
          user_id: user?.id,
          email: user?.email,
        });
      }
    };
    redirectToStripe();
  }, [session]);

  return (
    <div className="mt-10 flex h-full w-full flex-col items-center">
      <EmptyPlaceholder>
        <EmptyPlaceholder.Title>
          Please complete the payment process...
        </EmptyPlaceholder.Title>
      </EmptyPlaceholder>
    </div>
  );
}

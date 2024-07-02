'use server';

import { AllRaces, db, User, usersTable } from '@8hourrelay/database';

import { eq } from 'drizzle-orm';
import 'server-only';
import Stripe from 'stripe';

const apiKey = process.env.STRIPE_SECRET;

const stripe = new Stripe(apiKey!, {
  apiVersion: '2024-04-10',
  typescript: true,
});

export const createStripeSession = async (
  user: User,
  race: Pick<AllRaces[0], 'isCompetitive' | 'stripePrice'>
) => {
  const email = user.email;

  if (!email) {
    throw new Error(`User without email. Invalid data.`);
  }
  if (!user.customerId) {
    // create a new customer in Stripe
    const newCustomer = await stripe.customers.create({
      email,
    });

    if (!newCustomer) {
      throw new Error(`Failed to create Stripe customer. Invalid data.`);
    }
    user.customerId = newCustomer.id;
    await db
      .update(usersTable)
      .set({
        customerId: newCustomer.id,
      })
      .where(eq(usersTable.id, user.id));
  }

  if (!race || !race.stripePrice || !race.stripePrice.id) {
    throw new Error(`Invalid race data.`);
  }

  // create a new checkout session
  const priceId = race.stripePrice.id;
  const quantity = race.isCompetitive ? 12 : 1;
  return newStripeSession(user.customerId, priceId, quantity);
};

export const newStripeSession = async (
  customerId: string,
  priceId: string,
  quantity: number
) => {
  const sessionCreateParams: Stripe.Checkout.SessionCreateParams = {
    customer: customerId,
    mode: 'payment',
    line_items: [
      {
        price: priceId,
        quantity,
      },
    ],
    allow_promotion_codes: true,
    success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/payment?success=true&session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/payment?canceled=true`,
  };

  const session = await stripe.checkout.sessions.create(sessionCreateParams);
  console.debug(`Created stripe session`, { session });
  return session as Stripe.Response<Stripe.Checkout.Session>;
};

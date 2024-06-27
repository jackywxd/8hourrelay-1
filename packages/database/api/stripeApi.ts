import 'server-only';

import Stripe from 'stripe';
import { NewTeam, Race, User, getRaceById } from '@8hourrelay/database';

const apiKey = process.env.STRIPE_SECRET;

const stripe = new Stripe(apiKey!, {
  apiVersion: '2024-04-10',
  typescript: true,
});

const HOST_NAME =
  process.env.ENV === 'prod'
    ? 'https://8hourrelay.com'
    : process.env.ENV === 'staging'
      ? 'https://staging.8hourrelay.com'
      : 'https://staging.8hourrelay.com';

export const listStripePrices = async (lookup_keys: string[]) => {
  const products = await stripe.prices.list({
    lookup_keys,
  });

  return products;
};

export const createStripeCheckout = async (user: User, newTeam: NewTeam) => {
  const customer = user.customerId;
  const email = user.email;

  if (!customer || !email) {
    throw new Error(`User without email and customerId. Invalid data.`);
  }

  if (!newTeam.raceId) {
    throw new Error(`Race not found. Invalid data.`);
  }

  const race: Race | null = await getRaceById(newTeam.raceId);

  if (!race) {
    throw new Error(`Race not found. Invalid data.`);
  }
  const priceId = race?.stripePrice.id;

  const sessionCreateParams: Stripe.Checkout.SessionCreateParams = {
    customer,
    mode: 'payment',
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    discounts: [
      {
        coupon: '{{COUPON_ID}}',
      },
    ],
    allow_promotion_codes: true,
    success_url: `${HOST_NAME}/payment?success=true&session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${HOST_NAME}/payment?canceled=true`,
  };

  const session = await stripe.checkout.sessions.create(sessionCreateParams);
  console.debug(`Created stripe session`, { session });
  return session;
};

import 'server-only';

import Stripe from 'stripe';
const apiKey = process.env.STRIPE_SECRET;
export const stripe = new Stripe(apiKey as string, {
  // https://github.com/stripe/stripe-node#configuration
  apiVersion: '2024-04-10',
  typescript: true,
});

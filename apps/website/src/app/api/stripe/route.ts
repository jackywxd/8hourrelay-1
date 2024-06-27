import { slackSendMsg } from '@/lib/slack';
import { stripe } from '@/lib/stripe';
import { db, paymentStatusTable, sessionsTable } from '@8hourrelay/database';
import { eq } from 'drizzle-orm';
import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

// Stripe Signing secret
const endpointSecret = process.env.STRIPE_SIGNING_SECRET;

export async function POST(request: NextRequest) {
  const sig = request.headers.get('stripe-signature') as string;
  let event: Stripe.Event;
  if (!sig) {
    return NextResponse.json({ message: `Webhook Error` }, { status: 400 });
    return;
  }
  try {
    event = stripe.webhooks.constructEvent(
      await (await request.blob()).text(),
      sig,
      endpointSecret!
    );
  } catch (err) {
    await slackSendMsg(`Failed to validate stripe signature!!`);
    return NextResponse.json({ message: `Webhook Error` }, { status: 400 });
  }

  // Successfully constructed event.
  console.log('✅ Success:', event.id);

  const {
    type,
    data: { object },
  } = event;

  try {
    const now = new Date();
    switch (type) {
      case 'payment_intent.payment_failed': {
        const paymentIntent = object as Stripe.PaymentIntent;
        const msg = `🔔  Webhook received! Payment for PaymentIntent ${paymentIntent.id} failed.`;
        await Promise.all([slackSendMsg(msg)]);
        break;
      }
      // An invoice.payment_succeeded event is sent to indicate that the invoice was marked paid.
      // process subscription when it is already paid
      case 'invoice.payment_succeeded': {
        const invoice = event.data.object as Stripe.Invoice;
        const msg = `Invoice ${invoice.id} payment_succeeded`;
        await Promise.all([slackSendMsg(msg)]);
        break;
      }
      /* Once the source is chargeable, from your source.chargeable webhook handler, you can make a charge request using the source ID as the value for the source parameter to complete the payment
       */
      case 'source.chargeable': {
        const source = event.data.object as Stripe.Source;
        const msg = `🔔  Webhook received! The source ${source.id} is chargeable.`;
        if (source.metadata?.paymentIntent) {
          // Confirm the PaymentIntent with the chargeable source.
          await Promise.all([slackSendMsg(msg)]);
        }
        break;
      }
      case 'source.failed':
      case 'source.canceled': {
        const source = object as Stripe.Source;
        const msg = `🔔  The source ${source.id} failed or timed out.`;
        if (source.metadata?.paymentIntent) {
          await Promise.all([slackSendMsg(msg)]);
        }
        break;
      }
      // for metered billing host plan should go here
      case 'invoice.created': {
        const invoice = object as Stripe.Invoice;
        const msg = `🔔  The invoice ${invoice.id} created.`;
        await slackSendMsg(msg);
        // await Subscription.addInvoiceItems
        break;
      }
      // for wechat && Alipay payment webhooks
      case 'charge.succeeded': {
        const charge = object as Stripe.Charge;
        const msg = `🔔  The charge ${charge.id} succeeded.`;
        const paymentSession = await db.query.sessionsTable.findFirst({
          where: eq(
            sessionsTable.paymentIntentId,
            charge.payment_intent as string
          ),
        });

        if (!paymentSession) {
          console.log(
            `No session found for paymentIntentId ${charge.payment_intent}`
          );
          break;
        }

        await db.transaction(async (tx) => {
          await tx
            .update(sessionsTable)
            .set({
              receiptNumber: charge.receipt_number,
              receiptUrl: charge.receipt_url,
              updatedAt: now,
            })
            .where(eq(sessionsTable.sessionId, paymentSession.sessionId));
        });

        break;
      }
      case 'checkout.session.completed': {
        const session = object as Stripe.Checkout.Session;
        const msg = `🔔  Session ${session.id} completed!`;
        const sessionId = session.id;
        if (!session.payment_intent) {
          throw new Error(`No payment Intent!!`);
        }

        // retrieve checkout session from db and retrieve corresponding payment intent from stripe to check payment status
        const [paymentSession, paymentIntent] = await Promise.all([
          db.query.paymentStatusTable.findFirst({
            where: eq(paymentStatusTable.sessionId, sessionId),
            with: {
              raceEntry: {
                columns: {
                  email: true,
                },
              },
              user: {
                columns: {
                  email: true,
                },
              },
              team: {
                columns: {
                  name: true,
                },
              },
            },
          }),
          stripe.paymentIntents.retrieve(session.payment_intent as string),
        ]);
        console.log(`paymentSession`, paymentSession);
        await db
          .update(sessionsTable)
          .set({
            paymentIntentId: paymentIntent.id,
            status: session.status as string,
            paymentStatus: session.payment_status as string,
            payload: session,
            amount: session.amount_total as number,
            currency: session.currency as string,
            updatedAt: now,
          })
          .where(eq(sessionsTable.sessionId, sessionId));

        if (paymentSession?.team) {
          await slackSendMsg(
            `User ${paymentSession.user?.email} paid for team ${paymentSession.team.name}!`
          );
        }
        if (paymentSession?.raceEntry) {
          await slackSendMsg(
            `User ${paymentSession.user?.email} paid for race entry: ${paymentSession.raceEntry.email}!`
          );
        }
        break;
      }
      default: {
        await slackSendMsg(`Stripe event type ${type}`);
      }
    }
    return NextResponse.json({ message: 'Received' }, { status: 200 });
  } catch (error) {
    console.log(error);
    await slackSendMsg(
      `Failed to process Stripe event! Type:${type} Data:${JSON.stringify(
        object
      )} Error: ${JSON.stringify(error)}`
    );
    return NextResponse.json(
      { message: 'Webhook handler failed' },
      { status: 500 }
    );
  }
}

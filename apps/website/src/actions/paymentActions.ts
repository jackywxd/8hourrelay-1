"use server";

import "server-only";

import { eq } from "drizzle-orm";
import { cache } from "react";

import {
  db,
  getPaymentBySessionId,
  getPromoCode,
  getValidPaymentSessionBySessionId,
  insertSessionSchema,
  NewSession,
  paymentStatusTable,
  raceEntriesTable,
  sessionsTable,
  teamsTable,
} from "@8hourrelay/database";

import { newStripeSession } from "./stripeApi";
import { isAuthenticated } from "./userActions";

export const createStripePayment = cache(async () => {});

export const isValidPromoCode = cache(async (code: string) => {
  try {
    if (!isAuthenticated()) {
      throw new Error("User not authenticated");
    }
    console.log(`isValidPromoCode`, code);
    const promoCode = await getPromoCode(code);
    if (!promoCode.isActive) {
      throw new Error("Promo code is not active");
    }
  } catch (error) {
    console.log(error);
    throw error;
  }
});

export const getValidPaymentBySessionId = cache(async (sessionId: string) => {
  try {
    if (!isAuthenticated()) {
      throw new Error("User not authenticated");
    }

    console.log(`getDataBySessionId`, sessionId);
    const paymentSession = await getValidPaymentSessionBySessionId(sessionId);
    return paymentSession;
  } catch (error) {
    console.log(error);
    throw error;
  }
});

export const getPaymentSessionBySessionId = cache(async (sessionId: string) => {
  try {
    if (!isAuthenticated()) {
      throw new Error("User not authenticated");
    }
    console.log(`getDataBySessionId`, sessionId);
    const paymentSession = await getPaymentBySessionId(sessionId);
    return paymentSession;
  } catch (error) {
    console.log(error);
    throw error;
  }
});

export const updateExpiredPaymentSession = cache(async (sessionId: string) => {
  try {
    if (!isAuthenticated()) {
      throw new Error("User not authenticated");
    }
    console.log(`updateExpiredPaymentSession`, sessionId);
    const paymentSession = await db.query.paymentStatusTable.findFirst({
      where: eq(paymentStatusTable.sessionId, sessionId),
      with: {
        team: true,
        raceEntry: true,
        user: true,
        session: true,
      },
    });

    if (!paymentSession) {
      throw new Error("Payment session not found");
    }
    const session = await newStripeSession(
      paymentSession.user?.customerId!,
      paymentSession.session?.priceId!,
      paymentSession.session?.quantity!,
    );
    let newSession: NewSession = {
      sessionId: session.id,
      priceId: paymentSession.session?.priceId!,
      productId: paymentSession.session?.productId as string,
      paymentIntentId: (session.payment_intent as string) ?? null, // null when payment is not completed
      status: session.status as string,
      paymentStatus: session.payment_status,
      amount: paymentSession.session?.amount!,
      currency: paymentSession.session?.currency!,
      expiresAt: new Date(session.expires_at * 1000),
      payload: session,
    };
    // this payment is for a team
    if (paymentSession.team) {
      newSession.quantity = 12;
      await db.transaction(async (tx) => {
        const validatedSessionData = insertSessionSchema.parse(newSession);
        // create a new session
        const returnSession = await tx
          .insert(sessionsTable)
          .values(validatedSessionData)
          .returning({ id: sessionsTable.sessionId });

        // update team to reference the new session
        const result = await tx
          .update(teamsTable)
          .set({ sessionId: returnSession[0].id })
          .where(eq(teamsTable.id, paymentSession.team?.id!));

        // update payment status to reference the new session
        await tx.update(paymentStatusTable).set({
          sessionId: returnSession[0].id,
        }).where(eq(paymentStatusTable.id, paymentSession.id));
        return result[0];
      });

      // this payment is for a race entry
    } else if (paymentSession.raceEntry) {
      newSession.quantity = 1;
      await db.transaction(async (tx) => {
        const validatedSessionData = insertSessionSchema.parse(newSession);
        // create a new session
        const returnedSession = await tx
          .insert(sessionsTable)
          .values(validatedSessionData)
          .returning({ id: sessionsTable.sessionId });

        // update race entry to reference the new session
        const result = await tx
          .update(raceEntriesTable)
          .set({ sessionId: returnedSession[0].id })
          .where(eq(raceEntriesTable.id, paymentSession.raceEntry?.id!));

        // update payment status to reference the new session
        await tx.update(paymentStatusTable).set({
          sessionId: returnedSession[0].id,
        }).where(eq(paymentStatusTable.id, paymentSession.id));
        return result[0];
      });
    }
    // return the session id to the client to redirect to stripe checkout
    return session.id;
  } catch (error) {
    console.log(error);
    throw error;
  }
});

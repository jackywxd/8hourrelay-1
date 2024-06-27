import "server-only";

import { and, eq } from "drizzle-orm";

import {
  db,
  insertPromoCodeSchema,
  PromoCode,
  promoCodesTable,
  selectPromoCodeSchema,
  selectSessionSchema,
  selectTeamSchema,
  sessionsTable,
  teamsTable,
} from "../db";

export const getValidPaymentSessionBySessionId = async (sessionId: string) => {
  const paymentSession = await db.query.sessionsTable.findFirst({
    where: and(eq(sessionsTable.sessionId, sessionId)),
  });
  console.log(`getValidPaymentSessionBySessionId ${sessionId}`, {
    paymentSession,
  });
  const validatedSession = selectSessionSchema.parse(paymentSession);
  return validatedSession;
};

export const getPaymentBySessionId = async (sessionId: string) => {
  const paymentSession = await db.query.paymentStatusTable.findFirst({
    where: (paymentStatusTable, { eq }) =>
      eq(paymentStatusTable.sessionId, sessionId),
    with: {
      team: { columns: { name: true } },
      raceEntry: {
        columns: { firstName: true, lastName: true, email: true, phone: true },
      },
    },
  });

  return paymentSession;
};

export type PaymentSession = Awaited<ReturnType<typeof getPaymentBySessionId>>;

export const getPaymentSessionByTeamId = async (teamId: number) => {
  const team = await db.query.teamsTable.findFirst({
    where: eq(teamsTable.id, teamId),
    with: {
      session: true,
    },
  });
  console.log(`getPaymentSessionByTeamId ${teamId}`, { team });
  if (!team) {
    throw new Error(`Team with id ${teamId} not found`);
  }
  const session = selectSessionSchema.parse(team.session);
  return session;
};

export const getPromoCode = async (promoCode: string) => {
  const result = await db
    .select()
    .from(promoCodesTable)
    .where(eq(promoCodesTable.code, promoCode))
    .limit(1);
  const promo = selectPromoCodeSchema.parse(result[0]);
  return promo;
};

export const updatePromoCode = async (id: number, data: Partial<PromoCode>) => {
  const validatedData = insertPromoCodeSchema.parse(data);
  const result = await db
    .update(promoCodesTable)
    .set(validatedData)
    .where(eq(promoCodesTable.id, id));
  return result;
};

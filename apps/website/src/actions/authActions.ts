'use server';

import { createClient } from '@/supabase/server';
import 'server-only';

export const login = async (form: {
  /** The user's email address. */
  email: string;
  /** The user's password. */
  password: string;
  /** Verification token received when the user completes the captcha on the site. */
  captchaToken?: string;
}) => {
  const supabase = createClient();
  const signed = await supabase.auth.signInWithPassword({
    email: form.email,
    password: form.password,
    options: {
      captchaToken: form.captchaToken ?? undefined,
    },
  });
  return signed;
};

export const signUp = async (form: {
  /** The user's email address. */
  email: string;
  /** The user's password. */
  password: string;
  /** Verification token received when the user completes the captcha on the site. */
  captchaToken?: string;
}) => {
  const supabase = createClient();
  const signed = await supabase.auth.signUp({
    email: form.email,
    password: form.password,
    options: {
      captchaToken: form.captchaToken ?? undefined,
    },
  });
  await supabase.auth.signOut();
  return signed;
};

export const forgotPassword = async (form: {
  /** The user's email address. */
  email: string;
  /** Verification token received when the user completes the captcha on the site. */
  captchaToken?: string;
  redirectTo?: string;
}) => {
  const supabase = createClient();
  const result = await supabase.auth.resetPasswordForEmail(form?.email, {
    captchaToken: form.captchaToken,
    // A URL to send the user to after they are confirmed.
    // Don't forget to change the URL in supabase's email template.
    redirectTo: form.redirectTo,
  });
  return result;
};

export const changePassword = async (token_hash: string, password: string) => {
  const supabase = createClient();
  // login user with token
  const { error } = await supabase.auth.verifyOtp({
    type: 'recovery',
    token_hash,
  });
  if (error) throw new Error(error?.message);
  // update the user's password
  const updated = await supabase.auth.updateUser({
    password,
  });

  if (updated?.error) throw new Error(updated?.error?.message);

  const unsigned = await supabase.auth.signOut();
  if (unsigned?.error) throw new Error(unsigned?.error?.message);

  return updated;
};

import { slackSendMsg } from '@/lib/slack';
import { Database } from '@/types/supabase';
import { CookieOptions, createServerClient } from '@supabase/ssr';
import { type EmailOtpType } from '@supabase/supabase-js';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const token_hash = searchParams.get('token_hash');
  const type = searchParams.get('type') as EmailOtpType | null;
  const next = searchParams.get('next') ?? '/';
  const redirectTo = request.nextUrl.clone();
  redirectTo.pathname = next;
  const cookieStore = cookies();

  if (token_hash && type) {
    const supabase = createServerClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value;
          },
          set(name: string, value: string, options: CookieOptions) {
            try {
              cookieStore.set({ name, value, ...options });
            } catch (error) {
              // The `set` method was called from a Server Component.
              // This can be ignored if you have middleware refreshing
              // user sessions.
            }
          },
          remove(name: string, options: CookieOptions) {
            try {
              cookieStore.set({ name, value: '', ...options });
            } catch (error) {
              // The `delete` method was called from a Server Component.
              // This can be ignored if you have middleware refreshing
              // user sessions.
            }
          },
        },
      }
    );

    const { error, data } = await supabase.auth.verifyOtp({
      type,
      token_hash,
    });
    console.log(data);
    console.log('SEARCH PARAMS');
    console.log(searchParams);

    if (!error) {
      return NextResponse.redirect(redirectTo);
    } else {
      await slackSendMsg(
        `Failed to verify OTP! ${error.message}! redirect to /auth/unauthorized`
      );
      // return the user to an error page with some instructions
      redirectTo.searchParams.set('message', error.message);
      redirectTo.pathname = `/auth/unauthorized`;
      return NextResponse.redirect(redirectTo);
    }
  } else {
    redirectTo.pathname = '/';
    return NextResponse.redirect(redirectTo);
  }
}

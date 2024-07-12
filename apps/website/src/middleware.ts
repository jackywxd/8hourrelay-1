import { accessDenied } from '@/config/middleware';
import { updateSession } from '@/supabase/middleware';
import { type NextRequest, NextResponse } from 'next/server';

// Server Components only have read access to cookies.
// This Middleware example can be used to refresh expired sessions before loading Server Component routes.
export async function middleware(request: NextRequest) {
  const { response, authenticated } = await updateSession(request);
  console.log('middleware', { authenticated, url: request.url });

  // Access Control Logic
  const deniedRule = accessDenied.find((rule) => {
    return (
      request.nextUrl.pathname.startsWith(rule.from) &&
      authenticated === rule.authenticated
    );
  });

  if (deniedRule) {
    return NextResponse.redirect(new URL(deniedRule.to, request.url));
  }

  return response;
}

// Improved Configuration with Negative Lookahead
export const config = {
  matcher: ['/', '/auth/:path*'],
};

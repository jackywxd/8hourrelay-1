import { accessDenied } from '@/config/middleware';
import { updateSession } from '@/supabase/middleware';
import { type NextRequest, NextResponse } from 'next/server';
import { slackSendMsg } from './lib/slack';

// Server Components only have read access to cookies.
// This Middleware example can be used to refresh expired sessions before loading Server Component routes.
export async function middleware(request: NextRequest) {
  const { response, authenticated } = await updateSession(request);
  console.log(`middleware`, { authenticated, ur: request.url });
  const denied = accessDenied.filter((deny) => {
    if (!request.nextUrl.pathname.startsWith(deny.from)) return;
    if (authenticated !== deny?.authenticated) return;
    return deny;
  })[0];
  console.log(`denied`, denied);
  if (denied) {
    await slackSendMsg(`Access Denied! ${JSON.stringify(denied)}`);
    return NextResponse.redirect(new URL(denied.to, request.url));
  }

  return response;
}

export const config = {
  matcher: [
    // "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|json)$).*)",
    '/',
    '/auth/:path*',
    '/dashboard/:path*',
  ],
};

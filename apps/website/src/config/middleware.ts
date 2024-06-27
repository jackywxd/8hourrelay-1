import { MiddlewareAccessDenied } from '@/types/config';

// Make sure the new route is registered in the middleware.
// The default registered router routes are as follows:
// ['/', '/auth/:path*', '/dashboard/:path*']

export const accessDenied: MiddlewareAccessDenied[] = [
  {
    from: '/account',
    to: '/auth',
    authenticated: false,
  },
  {
    from: '/my-team',
    to: '/auth',
    authenticated: false,
  },
  {
    from: '/my-registrations',
    to: '/auth',
    authenticated: false,
  },
  {
    from: '/auth/reset-password',
    to: '/auth',
    authenticated: false,
  },
  {
    from: '/api/v1',
    to: '/auth',
    authenticated: false,
  },
  {
    from: '/auth/signin',
    to: '/',
    authenticated: true,
  },
  {
    from: '/auth',
    to: '/',
    authenticated: true,
  },
  {
    from: '/auth/signup',
    to: '/',
    authenticated: true,
  },
];

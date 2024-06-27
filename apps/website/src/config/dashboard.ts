import { DashboardConfig } from '@/types/index';

export const dashboardConfig: DashboardConfig = {
  mainNav: [
    {
      title: 'Account',
      href: '/account',
    },
    {
      title: 'My Registrations',
      href: '/my-registrations',
    },
    {
      title: 'My Team',
      href: '/my-team',
    },
  ],
  sidebarNav: [
    {
      title: 'Profile',
      href: '/account',
      icon: 'settings',
    },
    {
      title: 'My Race',
      href: '/account/my-race',
      icon: 'trophy',
    },
    {
      title: 'My Team',
      href: '/my-team',
      icon: 'users',
    },
  ],
};

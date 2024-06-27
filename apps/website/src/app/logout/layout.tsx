import { Metadata } from 'next';

import Footer from '@/components/Footer';
import { MainNav } from '@/components/main-nav';
import { UserAccountNav } from '@/components/user-account-nav';
import { dashboardConfig } from '@/config/dashboard';

interface DashboardLayoutProps {
  children?: React.ReactNode;
}

export const metadata: Metadata = {
  title: 'Account Login Out',
  description: 'Login out 8 hour relay account',
};

export default async function DashboardLayout({
  children,
}: DashboardLayoutProps) {
  return (
    <div className="flex min-h-screen w-full flex-col md:space-y-6">
      <header className="sticky top-0 z-40 flex w-full justify-center border-b bg-background">
        <div className="container flex h-16 items-center justify-between md:py-4">
          <MainNav items={dashboardConfig.mainNav} />
          <UserAccountNav />
        </div>
      </header>
      <div className="container mx-auto flex h-full w-full flex-grow flex-col items-center justify-center md:w-[800px]">
        {children}
      </div>
      <Footer className="border-t px-10" />
    </div>
  );
}

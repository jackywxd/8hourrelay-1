import { Metadata } from 'next';
import { dashboardConfig } from '@/config/dashboard';
import { MainNav } from '@/components/main-nav';
import { UserAccountNav } from '@/components/user-account-nav';
import Footer from '@/components/Footer';

interface DashboardLayoutProps {
  children?: React.ReactNode;
}

export const metadata: Metadata = {
  title: 'Account Settings',
  description: 'Your 8 hour relay account settings',
};

export default async function DashboardLayout({
  children,
}: DashboardLayoutProps) {
  return (
    <div className="flex min-h-screen w-full flex-col items-center md:space-y-6">
      <header className="sticky top-0 z-40 flex w-full justify-center border-b bg-background">
        <div className="container flex h-16 items-center justify-between md:py-4">
          <MainNav items={dashboardConfig.mainNav} />
          <UserAccountNav />
        </div>
      </header>
      <div className="flex w-full min-w-[320px] flex-1 justify-center p-2 md:w-[800px] md:max-w-[800px]">
        {children}
      </div>
      <div className="w-full">
        <Footer className="border-t px-10" />
      </div>
    </div>
  );
}

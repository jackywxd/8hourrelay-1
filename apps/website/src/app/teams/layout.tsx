import { dashboardConfig } from '@/config/dashboard';
import { Metadata } from 'next';
import Footer from '@/components/Footer';
import { MainNav } from '@/components/main-nav';
import { UserAccountNav } from '@/components/user-account-nav';

interface DashboardLayoutProps {
  children?: React.ReactNode;
}

export const metadata: Metadata = {
  title: '8 Hour Relay - Teams',
  description: 'Teams page for 8 Hour Relay',
};

export default async function DashboardLayout({
  children,
}: DashboardLayoutProps) {
  return (
    <div
      className={'flex min-h-screen w-full flex-col items-center bg-[#00356a]'}
    >
      <div className="flex w-full flex-1 flex-col">
        <div className="flex w-full flex-1 flex-grow flex-col">{children}</div>
        <div className="flex w-full flex-col self-end">
          <div className="container mx-auto text-white">
            <Footer />
          </div>
        </div>
      </div>
    </div>
  );
}

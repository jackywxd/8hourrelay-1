import { Metadata } from 'next';

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
  return <main className="flex w-full flex-1 flex-col">{children}</main>;
}

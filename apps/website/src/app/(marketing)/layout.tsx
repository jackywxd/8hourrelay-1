import { Metadata } from 'next';
import React from 'react';

import Footer from '@/components/Footer';
import Layout from '@/components/Layout';

export const metadata: Metadata = {
  title: '8 Hour Relay',
  description: 'Vancouver 8 hour relay official website',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen w-full flex-col items-center">
      <div className="flex w-full flex-1 flex-col">
        <div className="flex w-full flex-1 flex-grow flex-col">
          <Layout>{children}</Layout>
        </div>
        <div className="mx-auto flex w-full flex-1">
          <Footer />
        </div>
      </div>
    </div>
  );
}

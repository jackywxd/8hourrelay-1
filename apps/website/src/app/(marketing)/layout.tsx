import { Metadata } from 'next';
import React from 'react';

import Layout from '@/components/Layout';
import Footer from '@/components/Footer';

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
    <div className="flex flex-col min-h-screen w-full items-center">
      <div className="flex flex-col w-full flex-1">
        <div className="flex flex-col flex-1 w-full flex-grow">
          <Layout>{children}</Layout>
        </div>
        <div className="flex flex-col self-end w-full">
          <div className="container mx-auto">
            <Footer />
          </div>
        </div>
      </div>
    </div>
  );
}

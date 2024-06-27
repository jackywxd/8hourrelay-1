import { Inter as FontSans } from 'next/font/google';
import localFont from 'next/font/local';
import type { Viewport } from 'next';
import dynamic from 'next/dynamic';
import NextTopLoader from 'nextjs-toploader';

import '@/styles/globals.css';
import { siteConfig } from '@/config/site';
import { Toaster } from '@/components/ui/sonner';
import { defaultLng } from '@/i18next.config';
import { AppProvider } from '@/context/app-provider';

import { cn } from '@/lib/utils';
import GoogleAnalytics from '@/components/GoogleAnalytics';
import { TailwindIndicator } from '@/components/tailwind-indicator';
import { Analytics } from '@/components/analytics';

const PostHogPageView = dynamic(() => import('@/components/PostHogPageView'), {
  ssr: false,
});

const ogUrl = new URL(`${process.env.NEXT_PUBLIC_HOST_NAME}api/og`);

const fontSans = FontSans({
  subsets: ['latin'],
  variable: '--font-sans',
});

// Font files can be colocated inside of `pages`
const fontHeading = localFont({
  src: '../assets/fonts/CalSans-SemiBold.woff2',
  variable: '--font-heading',
});

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: 'white' },
    { media: '(prefers-color-scheme: dark)', color: 'black' },
  ],
};

export const metadata = {
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: [
    '8hourrelay',
    'Vancouver',
    '8 hour relay',
    'Running race',
    '4 hour youth relay',
  ],

  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: siteConfig.url,
    title: siteConfig.name,
    description: siteConfig.description,
    siteName: siteConfig.name,
    images: [
      {
        url: ogUrl.toString(),
        width: 1200,
        height: 630,
        alt: siteConfig.name,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: siteConfig.name,
    description: siteConfig.description,
    images: [ogUrl.toString()],
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },
  manifest: `${process.env.NEXT_PUBLIC_HOST_NAME}/site.webmanifest`,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang={defaultLng} suppressHydrationWarning>
      <GoogleAnalytics GA_TRACKING_ID={process.env.GA_TRACKING_ID!} />
      <body className={cn('font-sans antialiased', fontSans.variable)}>
        <NextTopLoader />
        <AppProvider>
          <div id="__next">{children}</div>
          <Toaster richColors closeButton />
          <TailwindIndicator />
          <Analytics />
          <PostHogPageView />
        </AppProvider>
      </body>
    </html>
  );
}

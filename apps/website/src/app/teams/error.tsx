'use client';

import { EmptyPlaceholder } from '@/components/empty-placeholder';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <html>
      <body>
        <div className="flex flex-col w-full h-full items-center mt-10">
          <EmptyPlaceholder>
            <EmptyPlaceholder.Icon name="close" className="text-red-500" />
            <EmptyPlaceholder.Title>
              Something went wrong! Please try again later.
            </EmptyPlaceholder.Title>
            <EmptyPlaceholder.Description></EmptyPlaceholder.Description>
            <Link href="/">
              <Button className="w-full">Go Home Now</Button>
            </Link>
          </EmptyPlaceholder>
        </div>
      </body>
    </html>
  );
}

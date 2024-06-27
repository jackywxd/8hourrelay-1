import * as React from 'react';
import Link from 'next/link';

import { cn } from '@/lib/utils';
import { ButtonProps, buttonVariants } from '@/components/ui/button';

interface RaceEntryCreateButtonProps extends ButtonProps {}

export function RaceEntryCreateButton({
  className,
  variant,
  ...props
}: RaceEntryCreateButtonProps) {
  return (
    <Link href="/registration">
      <button
        className={cn(buttonVariants({ variant }), 'mt-5', className)}
        {...props}
      >
        New Registration
      </button>
    </Link>
  );
}

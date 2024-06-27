import Link from 'next/link';

import { Icons } from '@/components/icons';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import Footer from '@/components/Footer';

interface AuthLayoutProps {
  children: React.ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="flex min-h-screen w-full flex-col items-center">
      <div className="container flex w-full flex-col px-2">
        <Link
          href="/"
          className={cn(
            buttonVariants({ variant: 'ghost' }),
            'absolute left-4 top-4 text-lg md:left-8 md:top-8'
          )}
        >
          <Icons.chevronLeft className="mr-2 h-6 w-6" />
          Home
        </Link>
      </div>
      <div className="mt-20 flex flex-1 flex-col">
        <div className="m-1 flex w-full flex-1 flex-grow flex-col">
          <section className="flex w-full flex-1 flex-col pl-1 pr-1 md:min-h-[400px] md:w-[800px]">
            {children}
          </section>
        </div>
      </div>
      <div className="w-full">
        <Footer />
      </div>
    </div>
  );
}

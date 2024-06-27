import Link from "next/link";
import { Metadata } from "next";

import { Icons } from "@/components/icons";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface AuthLayoutProps {
  children: React.ReactNode;
}
export const metadata: Metadata = {
  title: "Payment results",
  description: "Stripe payment results page",
};

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="min-h-screen">
      <div className="flex flex-col w-full h-full items-center mt-10">
        <div className="container flex px-2 h-screen w-full flex-col items-center justify-center">
          <Link
            href="/"
            className={cn(
              buttonVariants({ variant: "ghost" }),
              "absolute left-4 top-4 md:left-8 md:top-8"
            )}
          >
            <>
              <Icons.chevronLeft className="mr-2 h-4 w-4" />
              Home
            </>
          </Link>
          {children}
        </div>
      </div>
    </div>
  );
}

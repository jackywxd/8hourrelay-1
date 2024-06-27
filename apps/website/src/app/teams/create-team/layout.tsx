import Link from "next/link";

import { Icons } from "@/components/icons";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface AuthLayoutProps {
  children: React.ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="min-h-screen">
      <div className="flex flex-col w-full h-full items-center mt-10 text-white">
        <div className="container flex px-2 h-screen w-full flex-col">
          <Link
            href="/teams"
            className={cn(
              buttonVariants({ variant: "ghost" }),
              "absolute left-4 top-4 md:left-8 md:top-8"
            )}
          >
            <>
              <Icons.chevronLeft className="mr-2 h-4 w-4" />
              All Teams
            </>
          </Link>
          {children}
        </div>
      </div>
    </div>
  );
}

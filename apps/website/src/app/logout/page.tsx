'use client';

import { useRouter } from 'next/navigation';
import { usePostHog } from 'posthog-js/react';
import { useEffect } from 'react';
import { toast } from 'sonner';

import { useAuth } from '@/hooks';
import { createClient } from '@/supabase/client';
import { EmptyPlaceholder } from '@/components/empty-placeholder';

export default function Logout() {
  const router = useRouter();
  const { setSession, setUser } = useAuth();
  const posthog = usePostHog();

  useEffect(() => {
    async function logoutUser() {
      try {
        const supabase = createClient();
        const unsigned = await supabase.auth.signOut();

        posthog?.capture('user logged out');
        posthog?.reset();

        setSession(null);
        setUser(null);
        if (unsigned?.error) throw new Error(unsigned?.error?.message);

        router.refresh();
        router.replace('/');
      } catch (e: unknown) {
        toast.error((e as Error)?.message);
      }
    }
    logoutUser();
  }, []);

  return (
    <div className="mt-10 flex h-full w-full flex-col items-center">
      <EmptyPlaceholder>
        <EmptyPlaceholder.Icon name="logout" className="text-red-500" />
        <EmptyPlaceholder.Title>Signing out....</EmptyPlaceholder.Title>
        <EmptyPlaceholder.Description></EmptyPlaceholder.Description>
      </EmptyPlaceholder>
    </div>
  );
}

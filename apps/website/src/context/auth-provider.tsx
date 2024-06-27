'use client';

import * as React from 'react';

import { Session, User } from '@supabase/supabase-js';
import { createClient } from '@/supabase/client';
import { usePostHog } from 'posthog-js/react';

/**
 * Listen to auth events
 *
 * @link https://supabase.com/docs/reference/javascript/auth-onauthstatechange
 */
interface AuthContextProps {
  session: Session | null;
  user: User | null;
  setSession: React.Dispatch<React.SetStateAction<Session | null>>;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
}

const AuthContext = React.createContext<AuthContextProps>({
  session: null,
  user: null,
  setSession: () => void 0,
  setUser: () => void 0,
});

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [session, setSession] = React.useState<Session | null>(null);
  const [user, setUser] = React.useState<User | null>(null);
  const posthog = usePostHog();

  React.useEffect(() => {
    const supabase = createClient();
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        posthog.identify(
          session.user.id, // Replace 'distinct_id' with your user's unique identifier
          { email: session.user.email } // optional: set additional user properties
        );
      }
    });
    return () => subscription?.unsubscribe();
  }, []);

  const value = React.useMemo(() => {
    return { session, user, setSession, setUser };
  }, [session, user, setSession, setUser]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export { AuthContext, type AuthContextProps, AuthProvider };

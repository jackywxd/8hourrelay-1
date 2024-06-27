import { User as AuthUser, AuthError, Pagination } from '@supabase/supabase-js';
import { Email, Notification, Analysis } from '@/types/database';
import { User } from '@8hourrelay/database';

export type UserAPI =
  | { data: User | null; error: null }
  | { data: null; error: Error };

export type UsersAPI =
  | { data: { users: AuthUser[]; aud: string } & Pagination; error: null }
  | { data: { users: [] }; error: AuthError };

export type EmailAPI =
  | { data: Email; error: null }
  | { data: null; error: Error };

export type EmailsAPI =
  | { data: Email[]; error: null }
  | { data: null; error: Error };

export type NotificationAPI =
  | { data: Notification; error: null }
  | { data: null; error: Error };

export type AnalysisAPI =
  | { data: Analysis | null; error: null }
  | { data: null; error: Error };

import Link from 'next/link';
import { Suspense } from 'react';

import { getCurrentUser } from '@/actions/userActions';
import { EmptyPlaceholder } from '@/components/empty-placeholder';
import { FormSkeleton } from '@/components/FormSkeleton';
import { DashboardHeader } from '@/components/header';
import { DashboardShell } from '@/components/shell';
import { Button } from '@/components/ui/button';
import { slackSendMsg } from '@/lib/slack';
import ProfileForm from '../_components/ProfileForm';

export default async function Home() {
  // very stupid hack to make it work, supabase is slow
  let user = await getCurrentUser();
  if (!user) {
    await new Promise((resolve) => setTimeout(resolve, 3000));
    user = await getCurrentUser();
    if (!user) {
      await slackSendMsg('Failed to get user info from Supabase');
      return (
        <EmptyPlaceholder>
          <EmptyPlaceholder.Icon name="users" />
          <EmptyPlaceholder.Title>No Team available yet</EmptyPlaceholder.Title>
          <EmptyPlaceholder.Description>
            Failed to get user info! Please refresh the page and try again.
          </EmptyPlaceholder.Description>
          <Button>
            <Link className="link open-button" href="/">
              Back to Home
            </Link>
          </Button>
        </EmptyPlaceholder>
      );
    }
  }

  return (
    <DashboardShell>
      <DashboardHeader
        heading="Account Settings"
        text="Manage your account and settings."
      ></DashboardHeader>
      <div className="flex w-full justify-center">
        <Suspense fallback={<FormSkeleton items={5} />}>
          <ProfileForm user={user} />
        </Suspense>
      </div>
    </DashboardShell>
  );
}

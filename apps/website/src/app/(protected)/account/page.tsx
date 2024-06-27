import { Suspense } from 'react';

import { DashboardHeader } from '@/components/header';
import { DashboardShell } from '@/components/shell';
import { FormSkeleton } from '@/components/FormSkeleton';
import ProfileForm from '../_components/ProfileForm';
import { getCurrentUser } from '@/actions/userActions';
import { redirect } from 'next/navigation';

export default async function Home() {
  // very stupid hack to make it work, supabase is slow
  let user = await getCurrentUser();
  if (!user) {
    await new Promise((resolve) => setTimeout(resolve, 3000));
    user = await getCurrentUser();
    if (!user) {
      await new Promise((resolve) => setTimeout(resolve, 3000));
      user = await getCurrentUser();
      if (!user) {
        await new Promise((resolve) => setTimeout(resolve, 3000));
        user = await getCurrentUser();
      }
      if (!user) redirect('/');
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

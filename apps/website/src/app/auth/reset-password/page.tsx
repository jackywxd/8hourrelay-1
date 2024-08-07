import { redirect } from 'next/navigation';

import { ButtonLink } from '@/components/button-link';
import { Description } from '@/components/description';
import { LanguageToggleButton } from '@/components/language-toggle-button';
import { Logo } from '@/components/logo';
import { TextLink } from '@/components/text-link';
import { Title } from '@/components/title';

import { ResetPasswordForm } from './reset-password-form';

export default function ResetPasswordPage({
  searchParams,
}: {
  searchParams: {
    token_hash: string;
    type: string;
    next: string;
  };
}) {
  if (
    !/^pkce_/.test(searchParams?.token_hash) ||
    searchParams?.type !== 'recovery'
  ) {
    redirect('/auth/signin');
  }

  return (
    <div className="container flex min-h-screen w-screen flex-col items-center justify-center py-8">
      <ButtonLink
        href="/auth/signin"
        className="absolute left-4 top-4 md:left-8 md:top-8"
        startIconName="ChevronLeft"
        text="ButtonLink.signin"
        translate="yes"
      />
      <div className="mx-auto flex w-full max-w-[320px] flex-col justify-center space-y-6">
        <div className="flex flex-col space-y-2 text-center">
          <Logo />
          <Title text="ResetPasswordPage.title" translate="yes" />
          <Description text="ResetPasswordPage.description" translate="yes" />
        </div>
        <div className="grid gap-6">
          <ResetPasswordForm token_hash={searchParams?.token_hash} />
        </div>
        <div className="flex items-center justify-between text-sm">
          <TextLink
            href="/auth/signup"
            className="hover:underline"
            text="AuthLink.signup"
            translate="yes"
          />
          <LanguageToggleButton />
        </div>
      </div>
    </div>
  );
}

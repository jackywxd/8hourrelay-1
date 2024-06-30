'use client';

import HCaptcha from '@hcaptcha/react-hcaptcha';
import { useRouter } from 'next/navigation';
import * as React from 'react';
import { useTranslation } from 'react-i18next';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, useFormContext } from 'react-hook-form';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

import { useAuth } from '@/hooks/use-auth';
import { createClient } from '@/supabase/client';
import { usePostHog } from 'posthog-js/react';

const FormSchema = z
  .object({
    email: z.string().nonempty().max(255).email(),
    // If the password is larger than 72 chars, it will be truncated to the first 72 chars.
    newPassword: z.string().nonempty().min(6).max(72),
    confirmNewPassword: z.string().nonempty().min(6).max(72),
  })
  .refine((val) => val.newPassword === val.confirmNewPassword, {
    path: ['confirmNewPassword'],
    params: { i18n: 'invalid_confirm_password' },
  });

type FormValues = z.infer<typeof FormSchema>;

const defaultValues: Partial<FormValues> = {
  email: '',
  newPassword: '',
  confirmNewPassword: '',
};

const SignUpForm = () => {
  const captchaRef = React.useRef<HCaptcha | null>(null);
  const [captchaToken, setCaptchaToken] = React.useState<string | null>(null);
  const { setSession, setUser } = useAuth();
  const { t } = useTranslation();
  const onCaptchaChange = (token: string) => setCaptchaToken(token);
  const onCaptchaExpire = () => setCaptchaToken(null);
  const [isSubmitting, startTransition] = React.useTransition();
  const router = useRouter();
  const posthog = usePostHog();

  const form = useForm<FormValues>({
    resolver: zodResolver(FormSchema),
    mode: 'onSubmit',
    defaultValues,
  });

  function onSubmit(formValues: FormValues) {
    startTransition(async () => {
      try {
        const supabase = createClient();
        const signed = await supabase.auth.signUp({
          email: formValues?.email,
          password: formValues?.newPassword,
          options: {
            captchaToken: captchaToken ?? undefined,
          },
        });

        // reset captcha after signup
        captchaRef.current?.resetCaptcha();

        if (signed?.error) throw new Error(signed?.error?.message);

        const unsigned = await supabase.auth.signOut();
        if (unsigned?.error) throw new Error(unsigned?.error?.message);

        // Analytics
        posthog.capture('user_sign_up', { email: formValues?.email });
        setSession(null);
        setUser(null);

        toast.success(
          t('FormMessage.you_have_successfully_registered_as_a_member')
        );

        router.refresh();
        router.replace('/auth/signin');
      } catch (e: unknown) {
        const err = (e as Error)?.message;
        if (err.startsWith('User already registered')) {
          toast.error(t('FormMessage.user_already_registered'));
        } else {
          toast.error(err);
        }
      }
    });
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        method="POST"
        noValidate
        className="space-y-4"
      >
        <EmailField />
        <NewPasswordField />
        <ConfirmNewPasswordField />
        {process.env.NEXT_PUBLIC_ENV === 'dev1' && (
          <HCaptcha
            sitekey={process.env.NEXT_PUBLIC_HCAPTCHA_SITE_KEY!}
            onVerify={onCaptchaChange}
            ref={captchaRef}
            onExpire={onCaptchaExpire}
          />
        )}
        <Button type="submit" disabled={isSubmitting} className="w-full">
          {t('FormSubmit.signup')}
        </Button>
      </form>
    </Form>
  );
};

const EmailField = () => {
  const { t } = useTranslation();
  const { control } = useFormContext();

  return (
    <FormField
      control={control}
      name="email"
      render={({ field }) => (
        <FormItem>
          <FormLabel>{t('FormLabel.email')}</FormLabel>
          <FormControl>
            <Input
              type="email"
              autoCapitalize="none"
              autoComplete="email"
              autoCorrect="off"
              placeholder="name@example.com"
              {...field}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

const NewPasswordField = () => {
  const { t } = useTranslation();
  const { control } = useFormContext();

  return (
    <FormField
      control={control}
      name="newPassword"
      render={({ field }) => (
        <FormItem>
          <FormLabel>{t('FormLabel.password')}</FormLabel>
          <FormControl>
            <Input
              type="password"
              autoCapitalize="none"
              autoComplete="new-password"
              autoCorrect="off"
              placeholder={t('FormLabel.password')}
              {...field}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

const ConfirmNewPasswordField = () => {
  const { t } = useTranslation();
  const { control } = useFormContext();

  return (
    <FormField
      control={control}
      name="confirmNewPassword"
      render={({ field }) => (
        <FormItem>
          <FormLabel>{t('FormLabel.confirm_password')}</FormLabel>
          <FormControl>
            <Input
              type="password"
              autoCapitalize="none"
              autoComplete="new-password"
              autoCorrect="off"
              placeholder={t('FormLabel.confirm_password')}
              {...field}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export { SignUpForm };

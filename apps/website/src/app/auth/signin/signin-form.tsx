'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import * as React from 'react';
import { useTranslation } from 'react-i18next';

import HCaptcha from '@hcaptcha/react-hcaptcha';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, useFormContext } from 'react-hook-form';
import { z } from 'zod';

import { TextLink } from '@/components/text-link';
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

const FormSchema = z.object({
  email: z.string().nonempty().max(255).email(),
  password: z.string().nonempty().min(6).max(72),
});

type FormValues = z.infer<typeof FormSchema>;

const defaultValues: Partial<FormValues> = {
  email: '',
  password: '',
};

const SignInForm = () => {
  const captchaRef = React.useRef<HCaptcha | null>(null);
  const [captchaToken, setCaptchaToken] = React.useState<string | null>(null);
  const { setSession, setUser } = useAuth();
  const { t } = useTranslation();
  const onCaptchaChange = (token: string) => setCaptchaToken(token);
  const onCaptchaExpire = () => setCaptchaToken(null);
  const [isSubmitting, startTransition] = React.useTransition();
  const searchParams = useSearchParams();
  const router = useRouter();

  const form = useForm<FormValues>({
    resolver: zodResolver(FormSchema),
    mode: 'onSubmit',
    defaultValues,
  });

  const next = (searchParams.get('next') as string) ?? '/account';
  function onSubmit(formValues: FormValues) {
    startTransition(async () => {
      try {
        console.log(`formValues`, formValues);
        const supabase = createClient();
        const signed = await supabase.auth.signInWithPassword({
          email: formValues?.email,
          password: formValues?.password,
          options: {
            captchaToken: captchaToken ?? undefined,
          },
        });
        // reset captcha after  login
        captchaRef.current?.resetCaptcha();
        if (signed?.error) throw new Error(signed?.error?.message);

        setSession(signed?.data?.session);
        setUser(signed?.data?.user);

        toast.success(t('FormMessage.you_have_successfully_logged_in'));

        router.refresh();
        router.replace(next);
      } catch (e: unknown) {
        const err = (e as Error)?.message;
        if (err.startsWith('Invalid login credentials')) {
          toast.error(t('FormMessage.invalid_login_credentials'));
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
        <PasswordField />
        {process.env.NEXT_PUBLIC_ENV !== 'dev' && (
          <HCaptcha
            sitekey={process.env.NEXT_PUBLIC_HCAPTCHA_SITE_KEY!}
            onVerify={onCaptchaChange}
            ref={captchaRef}
            onExpire={onCaptchaExpire}
          />
        )}

        <Button type="submit" disabled={isSubmitting} className="w-full">
          {t('FormSubmit.signin')}
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
              placeholder="Your email"
              {...field}
            />
          </FormControl>
          <FormMessage className="font-normal" />
        </FormItem>
      )}
    />
  );
};

const PasswordField = () => {
  const { t } = useTranslation();
  const { control } = useFormContext();

  return (
    <FormField
      control={control}
      name="password"
      render={({ field }) => (
        <FormItem>
          <div className="flex items-center justify-between">
            <FormLabel>{t('FormLabel.password')}</FormLabel>
            <TextLink
              href="/auth/forgot-password"
              className="text-sm underline hover:decoration-muted"
              text="AuthLink.forgot_password"
              translate="yes"
            />
          </div>
          <FormControl>
            <Input
              type="password"
              autoCapitalize="none"
              autoComplete="current-password"
              autoCorrect="off"
              placeholder={t('FormLabel.password')}
              {...field}
            />
          </FormControl>
          <FormMessage className="font-normal" />
        </FormItem>
      )}
    />
  );
};

export { SignInForm };

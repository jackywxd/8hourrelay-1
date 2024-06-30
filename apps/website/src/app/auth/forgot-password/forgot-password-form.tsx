'use client';

import { usePostHog } from 'posthog-js/react';
import * as React from 'react';
import { useForm, useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { z } from 'zod';

import { forgotPassword } from '@/actions/authActions';
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
import HCaptcha from '@hcaptcha/react-hcaptcha';
import { zodResolver } from '@hookform/resolvers/zod';

const FormSchema = z.object({
  email: z.string().nonempty().max(255).email(),
});

type FormValues = z.infer<typeof FormSchema>;

const defaultValues: Partial<FormValues> = {
  email: '',
};

const ForgotPasswordForm = () => {
  const captchaRef = React.useRef<HCaptcha | null>(null);
  const [captchaToken, setCaptchaToken] = React.useState<string | null>(null);
  const { t } = useTranslation();
  const onCaptchaChange = (token: string) => setCaptchaToken(token);
  const onCaptchaExpire = () => setCaptchaToken(null);
  const [isSubmitting, startTransition] = React.useTransition();

  const form = useForm<FormValues>({
    resolver: zodResolver(FormSchema),
    mode: 'onSubmit',
    defaultValues,
  });

  const posthog = usePostHog();

  function onSubmit(formValues: FormValues) {
    startTransition(async () => {
      try {
        const result = await forgotPassword({
          email: formValues?.email,
          captchaToken: captchaToken ?? undefined,
          // A URL to send the user to after they are confirmed.
          // Don't forget to change the URL in supabase's email template.
          redirectTo:
            process.env.NEXT_PUBLIC_SITE_URL +
            '/api/auth/confirm?next=/auth/reset-password',
        });

        // reset captcha after reset
        captchaRef.current?.resetCaptcha();
        if (result?.error) throw new Error(result?.error?.message);

        // Analytics
        posthog.capture('user_reset_password', { email: formValues?.email });
        toast.success(t('FormMessage.email_has_been_successfully_sent'));
      } catch (e: unknown) {
        toast.error((e as Error)?.message);
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
        {process.env.NEXT_PUBLIC_ENV === 'dev1' && (
          <HCaptcha
            sitekey={process.env.NEXT_PUBLIC_HCAPTCHA_SITE_KEY!}
            onVerify={onCaptchaChange}
            ref={captchaRef}
            onExpire={onCaptchaExpire}
          />
        )}
        <Button type="submit" disabled={isSubmitting} className="w-full">
          {t('FormSubmit.reset_my_password')}
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
          <FormMessage className="font-normal" />
        </FormItem>
      )}
    />
  );
};

export { ForgotPasswordForm };

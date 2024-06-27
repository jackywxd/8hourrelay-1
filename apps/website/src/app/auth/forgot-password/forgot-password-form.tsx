'use client';

import * as React from 'react';
import { useTranslation } from 'react-i18next';

import { useForm, useFormContext } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import { toast } from 'sonner';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

import { createClient } from '@/supabase/client';
import { usePostHog } from 'posthog-js/react';

const FormSchema = z.object({
  email: z.string().nonempty().max(255).email(),
});

type FormValues = z.infer<typeof FormSchema>;

const defaultValues: Partial<FormValues> = {
  email: '',
};

const ForgotPasswordForm = () => {
  const form = useForm<FormValues>({
    resolver: zodResolver(FormSchema),
    mode: 'onSubmit',
    defaultValues,
  });

  return (
    <Form {...form}>
      <form method="POST" noValidate className="space-y-4">
        <EmailField />
        <SubmitButton />
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

const SubmitButton = () => {
  const { t } = useTranslation();

  const { handleSubmit, reset, getValues } = useFormContext();
  const [isSubmitting, setIsSubmitting] = React.useState<boolean>(false);

  const posthog = usePostHog();

  const onSubmit = async () => {
    try {
      setIsSubmitting(true);

      const formValues = getValues();

      const supabase = createClient();
      const result = await supabase.auth.resetPasswordForEmail(
        formValues?.email,
        {
          // A URL to send the user to after they are confirmed.
          // Don't forget to change the URL in supabase's email template.
          redirectTo:
            process.env.NEXT_PUBLIC_SITE_URL +
            '/api/auth/confirm?next=/auth/reset-password',
        }
      );
      if (result?.error) throw new Error(result?.error?.message);

      // Analytics
      posthog.capture('user_reset_password', { email: formValues?.email });
      toast.success(t('FormMessage.email_has_been_successfully_sent'));

      reset();
    } catch (e: unknown) {
      toast.error((e as Error)?.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Button
      type="submit"
      onClick={handleSubmit(onSubmit)}
      disabled={isSubmitting}
      className="w-full"
    >
      {t('FormSubmit.reset_my_password')}
    </Button>
  );
};

export { ForgotPasswordForm };

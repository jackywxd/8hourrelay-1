'use client';

import { useRouter } from 'next/navigation';
import React from 'react';
import { useForm, useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { z } from 'zod';

import { changePassword } from '@/actions/authActions';
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
import { useAuth } from '@/hooks';
import { zodResolver } from '@hookform/resolvers/zod';

const FormSchema = z
  .object({
    newPassword: z.string().nonempty().min(6).max(72),
    confirmNewPassword: z.string().nonempty().min(6).max(72),
  })
  .refine((val) => val.newPassword === val.confirmNewPassword, {
    path: ['confirmNewPassword'],
    params: { i18n: 'invalid_confirm_password' },
  });

type FormValues = z.infer<typeof FormSchema>;

const defaultValues: Partial<FormValues> = {
  newPassword: '',
  confirmNewPassword: '',
};

const ResetPasswordForm = ({ token_hash }: { token_hash: string }) => {
  const [isSubmitting, startTransition] = React.useTransition();
  const { setSession, setUser } = useAuth();
  const { t } = useTranslation();
  const router = useRouter();

  const form = useForm<FormValues>({
    resolver: zodResolver(FormSchema),
    mode: 'onSubmit',
    defaultValues,
  });

  function onSubmit(formValues: FormValues) {
    startTransition(async () => {
      try {
        await changePassword(token_hash, formValues.newPassword);

        setSession(null);
        setUser(null);

        toast.success(t('FormMessage.changed_successfully'));

        router.refresh();
        router.replace('/auth/signin');
      } catch (e: unknown) {
        const err = (e as Error)?.message;
        if (
          err.startsWith(
            'New password should be different from the old password'
          )
        ) {
          toast.error(
            t(
              'FormMessage.new_password_should_be_different_from_the_old_password'
            )
          );
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
        <NewPasswordField />
        <ConfirmNewPasswordField />
        <Button type="submit" disabled={isSubmitting} className="w-full">
          {t('FormSubmit.change_password')}
        </Button>
      </form>
    </Form>
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
          <FormLabel>{t('FormLabel.new_password')}</FormLabel>
          <FormControl>
            <Input
              type="password"
              autoCapitalize="none"
              autoComplete="new-password"
              autoCorrect="off"
              placeholder={t('FormLabel.new_password')}
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
          <FormLabel>{t('FormLabel.confirm_new_password')}</FormLabel>
          <FormControl>
            <Input
              type="password"
              autoCapitalize="none"
              autoComplete="new-password"
              autoCorrect="off"
              placeholder={t('FormLabel.confirm_new_password')}
              {...field}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export { ResetPasswordForm };

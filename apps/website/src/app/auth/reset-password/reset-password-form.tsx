'use client';

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

import { changePassword } from '@/actions/authActions';
import { useAuth } from '@/hooks/use-auth';

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

const ResetPasswordForm = () => {
  const form = useForm<FormValues>({
    resolver: zodResolver(FormSchema),
    mode: 'onSubmit',
    defaultValues,
  });

  return (
    <Form {...form}>
      <form method="POST" noValidate className="space-y-4">
        <NewPasswordField />
        <ConfirmNewPasswordField />
        <SubmitButton />
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

const SubmitButton = () => {
  const router = useRouter();
  const { t } = useTranslation();
  const { handleSubmit, setError, getValues } = useFormContext();
  const { setSession, setUser } = useAuth();

  const [isSubmitting, setIsSubmitting] = React.useState<boolean>(false);

  const onSubmit = async () => {
    try {
      setIsSubmitting(true);

      const formValues = getValues();

      await changePassword(formValues.newPassword);

      setSession(null);
      setUser(null);

      toast.success(t('FormMessage.changed_successfully'));

      router.refresh();
      router.replace('/auth/signin');
    } catch (e: unknown) {
      const err = (e as Error)?.message;
      if (
        err.startsWith('New password should be different from the old password')
      ) {
        setError('newPassword', {
          message: t(
            'FormMessage.new_password_should_be_different_from_the_old_password'
          ),
        });
      } else {
        toast.error(err);
      }
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
      {t('FormSubmit.change_password')}
    </Button>
  );
};

export { ResetPasswordForm };

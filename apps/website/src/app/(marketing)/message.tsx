'use client';
import { useState, useEffect, useTransition } from 'react';
import { useForm } from 'react-hook-form';

import { sendMessage } from '@/actions/sendMsgActions';
import Loading from '@/components/Loading';
import { cn } from '@/lib/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
const messageFormSchema = z.object({
  name: z.string().min(1, { message: 'Name is required' }),
  email: z.string().email({ message: 'Enter a valid email address' }),
  message: z.string().min(1, { message: 'Message is required' }),
});

const init = {
  name: '',
  email: '',
  message: '',
};

function MessageForm() {
  const [pending, startTransition] = useTransition();
  const [success, setSuccess] = useState(false);

  const form = useForm({
    resolver: zodResolver(messageFormSchema),
    defaultValues: init,
  });

  useEffect(() => {
    if (success) {
      setTimeout(() => {
        setSuccess(false);
      }, 5000);
    }
  }, [success]);

  const onSubmit = async (data: z.infer<typeof messageFormSchema>) => {
    startTransition(async () => {
      try {
        console.log('onSubmit', data);
        await sendMessage(data);
        form.reset();
        setSuccess(true);
      } catch (error) {
        console.log(error);
      }
    });
  };
  return (
    <div className="content-container large text-white">
      <div className="contact-deck">
        Have question? Need some help?
        <p className="description">
          Send us messages and we will get back to you shortly.
        </p>
      </div>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="form-container">
          <div
            className={cn(
              'input-container required',
              form.getValues('name') && 'has-value'
            )}
          >
            <label htmlFor="name">
              <span>Name</span>
            </label>
            <input
              className={form.getValues('name') && 'has-value'}
              type="text"
              {...form.register('name')}
            />
            {form.formState.errors.name && (
              <div className="error-msg ml-2 text-sm text-red-400">
                {form.formState.errors.name.message}
              </div>
            )}
          </div>

          <div
            className={cn(
              'input-container required',
              form.getValues('email') && 'has-value'
            )}
          >
            <label htmlFor="email">
              <span>Email</span>
            </label>

            <input
              className={form.getValues('email') && 'has-value'}
              type="email"
              {...form.register('email')}
            />
            {form.formState.errors.email && (
              <div className="error-msg ml-2 text-sm text-red-400">
                {form.formState.errors.email.message}
              </div>
            )}
          </div>

          <div
            className={cn(
              'input-container required textarea span-2',
              form.getValues('message') && 'has-value'
            )}
          >
            <label htmlFor="messages">
              <span>Messages</span>
            </label>
            <textarea {...form.register('message')} />
            {form.formState.errors.message && (
              <div className="error-msg ml-2 text-sm text-red-400">
                {form.formState.errors.message.message}
              </div>
            )}
          </div>
        </div>

        <div className="button-container mb-20 mt-5">
          <button className="btn btn-large btn-primary blue">
            {pending ? (
              <div className="flex items-center gap-1">
                <Loading />
                <span>Sending</span>
              </div>
            ) : success ? (
              `Sent successfully`
            ) : (
              `Send`
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

export default MessageForm;

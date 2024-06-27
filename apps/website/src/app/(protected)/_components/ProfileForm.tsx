'use client';

import { toast } from 'sonner';
import { useForm } from 'react-hook-form';

import { Input } from '@/components/ui/input';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { User } from '@8hourrelay/database';

import { updateCurrentUser } from '@/actions/userActions';
import { getDirtyFields } from '@/lib/utils/form';
import { useTransition } from 'react';
import { Icons } from '@/components/icons';
import { Button } from '@/components/ui/button';

function ProfileForm({ user }: { user: User }) {
  const [pending, startTransition] = useTransition();
  const defaultValues: Partial<User> = {
    firstName: user?.firstName ?? '',
    lastName: user?.lastName ?? '',
    preferName: user?.preferName ?? '',
    phone: user?.phone ?? '',
    birthYear: user?.birthYear ?? '',
  };
  const form = useForm({
    defaultValues,
  });

  function onSubmit(formData: FormData) {
    startTransition(async () => {
      if (!form.formState.isDirty) {
        console.log(`form is not changed, just return`);
        return;
      }
      const dirtyFields = getDirtyFields(form.formState.dirtyFields, formData);
      console.log(`dirtyFields`, dirtyFields);
      if (Object.keys(dirtyFields).length === 0) {
        console.log(`no dirty fields`);
        return;
      }
      try {
        await updateCurrentUser(dirtyFields, '/account');
        toast.success(`Profile updated.`);
        form.reset();
      } catch (error) {
        console.log(error);
        toast.error(`Failed to update profile. Please try again later.`);
      }
    });
  }

  console.log(`profile form defaultValue`, defaultValues);
  return (
    <div className="w-full">
      <Card>
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
          <CardDescription>
            This information is used to identify you and your team
          </CardDescription>
          <CardDescription>Email: {user?.email}</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <div className="grid gap-2 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>First name</FormLabel>
                      <FormControl>
                        <Input placeholder="First Name" {...field} />
                      </FormControl>
                      <FormDescription>
                        Your first name as it appears on your ID
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="lastName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Last name</FormLabel>
                      <FormControl>
                        <Input placeholder="Last Name" {...field} />
                      </FormControl>
                      <FormDescription>
                        Your last name as it appears on your ID
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="preferName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Prefer name</FormLabel>
                    <FormControl>
                      <Input placeholder="Prefer Name" {...field} />
                    </FormControl>
                    <FormDescription>
                      You can set your prefer name will be used in the web
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone number</FormLabel>
                    <FormControl>
                      <Input placeholder="Phone number" {...field} />
                    </FormControl>
                    <FormDescription>
                      Your mobile number will be used to contact you
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="birthYear"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Year of birth</FormLabel>
                    <FormControl>
                      <Input placeholder="Year of birth" {...field} />
                    </FormControl>
                    <FormDescription>
                      Your year of birth will be used to identify you
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button disabled={!form.formState.isDirty || pending}>
                {pending && (
                  <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                )}
                Update Profile
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}

export default ProfileForm;

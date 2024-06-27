'use client';
import { Icons } from '@/components/icons';
import { Button, ButtonProps } from '@/components/ui/button';
import { useFormStatus } from 'react-dom';

export default function FormButton(p: ButtonProps) {
  const { children, ...props } = p;
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} {...props}>
      {pending && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
      {children}
    </Button>
  );
}

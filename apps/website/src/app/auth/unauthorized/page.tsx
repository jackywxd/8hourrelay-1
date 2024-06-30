'use client';
import { ButtonLink } from '@/components/button-link';
import { Error } from '@/components/error';
import { useSearchParams } from 'next/navigation';

type Props = {};

const Unauthorized = (props: Props) => {
  const params = useSearchParams();
  const message = params.get('message');

  return (
    <div className="relative">
      <ButtonLink
        href="/auth/signin"
        className="absolute left-4 top-4 md:left-8 md:top-8"
        startIconName="ChevronLeft"
        text="ButtonLink.signin"
        translate="yes"
      />
      <Error status="500" message={message ?? 'Unauthorized'} />
    </div>
  );
};

export default Unauthorized;

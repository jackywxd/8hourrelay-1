import { PropsWithChildren } from 'react';

export default function MyLayout({ children }: PropsWithChildren) {
  return <main>{children}</main>;
}

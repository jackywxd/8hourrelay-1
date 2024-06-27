import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'My Registration',
  description: 'Your 8 hour relay registrations',
};

function RaceEntryLayout({
  children, // will be a page or nested layout
  modal,
}: {
  children: React.ReactNode;
  modal: React.ReactNode;
}) {
  return (
    <>
      <div>{modal}</div>
      <div>{children}</div>
    </>
  );
}

export default RaceEntryLayout;

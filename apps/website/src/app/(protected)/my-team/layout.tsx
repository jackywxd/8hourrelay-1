import { Metadata } from 'next';
import './styles.css';

export const metadata: Metadata = {
  title: 'My Teams',
  description: 'Your 8 hour relay my teams settings',
};

function TeamLayout({
  children, // will be a page or nested layout
  modal,
}: {
  children: React.ReactNode;
  modal: React.ReactNode;
}) {
  return (
    <div className="min-h-[400px] w-full flex-1 md:w-[800px]">
      <div>{modal}</div>
      <div>{children}</div>
    </div>
  );
}

export default TeamLayout;

import { Icons } from './icons';

export default function Loading() {
  return (
    <div className="fixed top-1/2 left-1/2 ">
      <Icons.spinner className="animate-spin" />
    </div>
  );
}

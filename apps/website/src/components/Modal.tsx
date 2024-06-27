'use client';

import { Dialog, DialogOverlay, DialogContent } from '@/components/ui/dialog';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { ScrollArea } from './ui/scroll-area';

export function Modal({ children }: { children: React.ReactNode }) {
  const [showExitConfirmation, setShowExitConfirmation] = useState(false);
  const router = useRouter();

  const handleOpenChange = () => {
    router.back();
  };

  return (
    <Dialog defaultOpen={true} open={true} onOpenChange={handleOpenChange}>
      <DialogOverlay>
        <ScrollArea className="w-full">
          <DialogContent
            className={
              'max-h-screen overflow-y-scroll md:max-h-screen lg:max-w-screen-lg'
            }
          >
            {children}
          </DialogContent>
        </ScrollArea>
      </DialogOverlay>
    </Dialog>
  );
}

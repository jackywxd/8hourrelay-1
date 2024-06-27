import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';

export function Wavier() {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <span className="underline hover:cursor-pointer">Race Wavier</span>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <ScrollArea className="max-h-screen w-full rounded-md border p-4">
          <AlertDialogTitle>Race Waiver</AlertDialogTitle>
          <AlertDialogHeader>
            <AlertDialogDescription>
              In consideration of the acceptance of my application and the
              permission to participate as an entrant or competitor in the
              Vancouver 8 Hour Relay on Sunday, Sep. 10, 2023. I for myself, my
              heirs, executors, administrators, successors, and assigns, hereby
              release waiver and forever discharge the event organizers, and all
              their respective agents, officials, servants, claims, demands,
              damages, costs, expenses, actions, and causes of action, whether
              in law or equity, in respect of death, injury, loss or damage to
              my person or property howsoever caused rising or to arise by
              reason of my participation in the said event, whether as a
              spectator, participant, competitor or otherwise, whether prior to,
              during or subsequent to the event, and notwithstanding the same
              may be been contributed to, or occasioned by, the negligence of
              any of the aforesaid.
            </AlertDialogDescription>
            <AlertDialogDescription>
              I further hereby undertake or hold and save harmless and agree to
              indemnify all of the aforesaid from and against any and all
              liability incurred by any or all of them as a result of, or in any
              way connected with, my participation in the said event.
            </AlertDialogDescription>
            <AlertDialogDescription>
              By submitting this entry, I acknowledge having read, understood
              and agreed to the above waiver, release, and indemnity. I warrant
              that I am physically fit to participate in this event.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <Separator className="my-2" />
          <AlertDialogAction>OK</AlertDialogAction>
        </ScrollArea>
      </AlertDialogContent>
    </AlertDialog>
  );
}

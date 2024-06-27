import Image from 'next/image';
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
import sizeChartPng from '@/assets/img/shirt-size.png';

export function ShowSizeChart() {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <span className="underline hover:cursor-pointer text-xs">
          Size Chart
        </span>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <div className="relative h-full">
          <Image
            src={sizeChartPng}
            alt="sizeChart"
            placeholder="blur"
            sizes="100vw"
            width={1024}
            // style={{ objectFit: "cover" }}
          />
        </div>
        <AlertDialogFooter>
          <AlertDialogAction>Close</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

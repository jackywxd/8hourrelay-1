import sizeChartPng from '@/assets/img/shirt_size.jpg';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import Image from 'next/image';

export function ShowSizeChart() {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <span className="text-xs underline hover:cursor-pointer">
          Size Chart
        </span>
      </AlertDialogTrigger>
      <AlertDialogContent className="max-w-[800px] md:w-[1024px]">
        <div className="w-full">
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

import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useId } from 'react';

export function FormSkeleton({ items = 3 }: { items?: number }) {
  const id = useId();
  return (
    <Card className="w-full my-5">
      <CardHeader></CardHeader>
      {Array.from({ length: items }).map((_, i) => (
        <CardContent key={`${id}-${i}`}>
          <div className="flex w-full items-center space-x-4 ">
            <Skeleton className="h-12 w-12 rounded-full" />
            <div className="w-full space-y-2">
              <Skeleton className="h-4 w-7/8" />
              <Skeleton className="h-4 w-2/3" />
            </div>
          </div>
        </CardContent>
      ))}
      <CardFooter></CardFooter>
    </Card>
  );
}

'use client';
import { useFormStatus } from 'react-dom';

import { Button } from '@/components/ui/button';
import { useStepper } from '@/components/ui/stepper';

import { Icons } from './icons';

export default function StepperFormActions() {
  const {
    prevStep,
    resetSteps,
    isDisabledStep,
    hasCompletedAllSteps,
    isLastStep,
    isOptionalStep,
  } = useStepper();

  if (!prevStep || !resetSteps) return null;
  const { pending } = useFormStatus();

  return (
    <div className="mt-5 flex w-full justify-end gap-2">
      {hasCompletedAllSteps ? (
        <Button size="sm" onClick={resetSteps}>
          Reset
        </Button>
      ) : (
        <>
          <Button
            disabled={isDisabledStep}
            onClick={prevStep}
            size="sm"
            variant="secondary"
          >
            Prev
          </Button>
          {!isLastStep && isOptionalStep && (
            <Button size="sm" variant="secondary">
              Skip
            </Button>
          )}
          <Button type="submit" disabled={pending}>
            {pending && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
            {isLastStep ? 'Finish' : 'Next'}
          </Button>
        </>
      )}
    </div>
  );
}

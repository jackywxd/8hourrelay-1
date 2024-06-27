'use client';
import { Button } from '@/components/ui/button';
import { useStepper } from '@/components/ui/stepper';
import FormButton from './FormButton';

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
          <FormButton size="sm">{isLastStep ? 'Finish' : 'Next'}</FormButton>
        </>
      )}
    </div>
  );
}

import { cn } from "@/lib/utils";

interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
  labels?: string[];
}

export function StepIndicator({ currentStep, totalSteps, labels }: StepIndicatorProps) {
  const percentage = (currentStep / totalSteps) * 100;

  return (
    <div className="w-full" role="progressbar" aria-valuenow={currentStep} aria-valuemax={totalSteps}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-foreground">
          Step {currentStep} / {totalSteps}
          {labels?.[currentStep - 1] && (
            <span className="ml-2 text-muted-foreground">
              {labels[currentStep - 1]}
            </span>
          )}
        </span>
        <span className="text-sm text-muted-foreground">{Math.round(percentage)}%</span>
      </div>
      <div className="h-1.5 bg-muted rounded-full overflow-hidden">
        <div
          className="h-full bg-primary transition-all duration-300 ease-out rounded-full"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

interface StepDotsProps {
  currentStep: number;
  totalSteps: number;
  onStepClick?: (step: number) => void;
}

export function StepDots({ currentStep, totalSteps, onStepClick }: StepDotsProps) {
  return (
    <div className="flex items-center gap-2" role="tablist">
      {Array.from({ length: totalSteps }, (_, i) => i + 1).map((step) => (
        <button
          key={step}
          onClick={() => onStepClick?.(step)}
          disabled={!onStepClick || step > currentStep}
          role="tab"
          aria-selected={step === currentStep}
          aria-label={`Step ${step}`}
          className={cn(
            "w-2.5 h-2.5 rounded-full transition-all",
            step === currentStep
              ? "bg-primary w-6"
              : step < currentStep
              ? "bg-primary/50 hover:bg-primary/70"
              : "bg-muted"
          )}
        />
      ))}
    </div>
  );
}

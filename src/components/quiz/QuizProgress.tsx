"use client";

interface QuizProgressProps {
  currentStep: number;
  totalSteps: number;
}

export default function QuizProgress({ currentStep, totalSteps }: QuizProgressProps) {
  return (
    <div className="flex items-center justify-center gap-2">
      {Array.from({ length: totalSteps }).map((_, i) => (
        <div
          key={i}
          className={`h-2 rounded-full transition-all duration-300 ${
            i < currentStep
              ? "w-8 bg-accent-yellow"
              : i === currentStep
              ? "w-8 bg-primary"
              : "w-2 bg-muted-light"
          }`}
        />
      ))}
    </div>
  );
}

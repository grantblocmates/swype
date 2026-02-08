"use client";

interface QuizProgressProps {
  currentStep: number;
  totalSteps: number;
}

export default function QuizProgress({ currentStep, totalSteps }: QuizProgressProps) {
  return (
    <div className="flex items-center justify-center gap-1">
      {Array.from({ length: totalSteps }).map((_, i) => (
        <div
          key={i}
          className={`h-2 flex-1 max-w-[80px] rounded-full transition-all duration-300 ease-out ${
            i < currentStep
              ? "bg-accent-yellow"
              : i === currentStep
              ? "bg-primary"
              : "bg-border"
          }`}
        />
      ))}
    </div>
  );
}

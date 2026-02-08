"use client";

interface QuizProgressProps {
  currentStep: number;
  totalSteps: number;
}

export default function QuizProgress({ currentStep, totalSteps }: QuizProgressProps) {
  const fillPercent = ((currentStep + 1) / totalSteps) * 100;

  return (
    <div className="w-full max-w-[240px] mx-auto">
      <div className="h-1.5 rounded-full bg-dark/[0.06] overflow-hidden">
        <div
          className="h-full rounded-full bg-primary transition-all duration-[400ms] ease-out"
          style={{ width: `${fillPercent}%` }}
        />
      </div>
    </div>
  );
}

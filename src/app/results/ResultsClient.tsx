"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import Header from "@/components/Header";
import QuizResults from "@/components/quiz/QuizResults";
import { paramsToAnswers } from "@/lib/quiz-logic";
import type { TierCardPreview } from "@/lib/types";

interface ResultsClientProps {
  cards: TierCardPreview[];
}

function ResultsContent({ cards }: ResultsClientProps) {
  const searchParams = useSearchParams();
  const answers = paramsToAnswers(searchParams);

  return (
    <div className="min-h-screen">
      <Header />
      <main className="py-10">
        <QuizResults cards={cards} answers={answers} />
      </main>
    </div>
  );
}

export default function ResultsClient({ cards }: ResultsClientProps) {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen">
          <Header />
          <main className="py-10">
            <div className="text-center py-20">
              <p className="text-muted">Loading your results...</p>
            </div>
          </main>
        </div>
      }
    >
      <ResultsContent cards={cards} />
    </Suspense>
  );
}

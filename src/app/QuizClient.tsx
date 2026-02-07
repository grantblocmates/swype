"use client";

import Header from "@/components/Header";
import QuizContainer from "@/components/quiz/QuizContainer";

export default function QuizClient() {
  return (
    <div className="min-h-screen">
      <Header />
      <main className="max-w-2xl mx-auto px-4 py-10">
        {/* Hero */}
        <div className="text-center mb-10">
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground tracking-tight">
            Find your perfect crypto card
          </h1>
          <p className="text-muted text-sm mt-3 max-w-md mx-auto leading-relaxed">
            4 quick questions. Personalized results. No signup required.
          </p>
        </div>

        <QuizContainer />
      </main>
    </div>
  );
}

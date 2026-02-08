"use client";

import Header from "@/components/Header";
import QuizContainer from "@/components/quiz/QuizContainer";
import FAQ from "@/components/FAQ";

export default function QuizClient() {
  return (
    <div className="min-h-screen">
      <Header />
      <main className="max-w-2xl mx-auto px-4 py-10">
        {/* Hero */}
        <div className="text-center mb-12">
          <h1 className="text-3xl sm:text-4xl font-display font-extrabold text-dark tracking-[-0.02em]">
            Find your perfect crypto card
          </h1>
          <p className="text-muted font-body text-sm mt-3 max-w-md mx-auto leading-relaxed">
            4 quick questions. Personalized results. No signup required.
          </p>
        </div>

        <QuizContainer />
      </main>

      {/* FAQ Section */}
      <div className="mt-16">
        <FAQ />
      </div>
    </div>
  );
}

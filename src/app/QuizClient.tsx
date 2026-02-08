"use client";

import Header from "@/components/Header";
import QuizContainer from "@/components/quiz/QuizContainer";
import FAQ from "@/components/FAQ";

export default function QuizClient() {
  return (
    <div className="min-h-screen">
      <Header />
      <main className="relative max-w-2xl mx-auto px-4 py-12 overflow-hidden">
        {/* Ambient background blobs */}
        <div
          className="ambient-blob w-[300px] h-[300px] -top-10 -right-20"
          style={{ background: "#C3DCA8", opacity: 0.15 }}
        />
        <div
          className="ambient-blob w-[250px] h-[250px] top-[400px] -left-32"
          style={{ background: "#2684FC", opacity: 0.1 }}
        />
        <div
          className="ambient-blob w-[200px] h-[200px] bottom-40 right-0"
          style={{ background: "#DAD4E2", opacity: 0.08 }}
        />

        {/* Hero */}
        <div className="relative z-[1] text-center mb-14">
          <h1 className="text-3xl sm:text-4xl font-display font-extrabold text-dark tracking-[-0.02em]">
            Find your perfect crypto card
          </h1>
          <p className="text-muted font-body text-sm mt-3 max-w-md mx-auto leading-relaxed">
            4 quick questions. Personalized results. No signup required.
          </p>
        </div>

        <div className="relative z-[1]">
          <QuizContainer />
        </div>
      </main>

      {/* FAQ Section */}
      <div className="mt-16">
        <FAQ />
      </div>
    </div>
  );
}

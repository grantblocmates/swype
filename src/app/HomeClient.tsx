"use client";

import { useRouter } from "next/navigation";
import type { CardPreviewData } from "@/lib/types";
import Header from "@/components/Header";
import SwipeCarousel from "@/components/SwipeCarousel";
import { Sparkles } from "lucide-react";

interface HomeClientProps {
  cards: CardPreviewData[];
}

export default function HomeClient({ cards }: HomeClientProps) {
  const router = useRouter();

  function handleCardTap(card: CardPreviewData) {
    router.push(`/card/${card.slug}`);
  }

  return (
    <div className="min-h-screen">
      <Header />

      <main className="max-w-2xl mx-auto px-4 py-8">
        {/* Hero */}
        <div className="text-center mb-6">
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground tracking-tight">
            Find your perfect crypto card
          </h1>
          <p className="text-muted text-sm mt-2 max-w-md mx-auto">
            Swipe right to save, left to skip. Tap a card for full details.
            Compare your favorites side by side.
          </p>
        </div>

        {/* How it works */}
        <div className="flex justify-center gap-6 mb-6 text-xs text-muted">
          <div className="flex items-center gap-1.5">
            <span className="w-6 h-6 rounded-full bg-secondary/10 text-secondary flex items-center justify-center text-xs font-bold">
              &#8592;
            </span>
            Skip
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-6 h-6 rounded-full bg-subtle text-muted flex items-center justify-center">
              <Sparkles className="w-3 h-3" />
            </span>
            Tap for details
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-6 h-6 rounded-full bg-accent/10 text-accent flex items-center justify-center text-xs font-bold">
              &#8594;
            </span>
            Save
          </div>
        </div>

        {/* Carousel */}
        {cards.length > 0 ? (
          <SwipeCarousel cards={cards} onCardTap={handleCardTap} />
        ) : (
          <div className="text-center py-20">
            <p className="text-muted">No cards available yet.</p>
            <p className="text-muted-light text-sm mt-1">
              Check back soon or add cards via the admin panel.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}

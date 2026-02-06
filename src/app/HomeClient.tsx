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

      <main className="max-w-lg mx-auto px-4 py-8">
        {/* Hero */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white">
            Find your perfect crypto card
          </h1>
          <p className="text-zinc-400 text-sm mt-2 max-w-md mx-auto">
            Swipe right to save, left to skip. Tap a card for full details.
            Compare your favorites side by side.
          </p>
        </div>

        {/* How it works */}
        <div className="flex justify-center gap-6 mb-8 text-xs text-zinc-500">
          <div className="flex items-center gap-1.5">
            <span className="w-6 h-6 rounded-full bg-danger/10 text-danger flex items-center justify-center text-xs font-bold">
              &#8592;
            </span>
            Skip
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-6 h-6 rounded-full bg-white/5 text-zinc-400 flex items-center justify-center">
              <Sparkles className="w-3 h-3" />
            </span>
            Tap for details
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-6 h-6 rounded-full bg-success/10 text-success flex items-center justify-center text-xs font-bold">
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
            <p className="text-zinc-400">No cards available yet.</p>
            <p className="text-zinc-500 text-sm mt-1">
              Check back soon or add cards via the admin panel.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}

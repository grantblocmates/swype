"use client";

import { useRouter } from "next/navigation";
import type { TierCardPreview } from "@/lib/types";
import Header from "@/components/Header";
import SwipeCarousel from "@/components/SwipeCarousel";
import { Sparkle } from "@phosphor-icons/react";

interface BrowseClientProps {
  cards: TierCardPreview[];
}

export default function BrowseClient({ cards }: BrowseClientProps) {
  const router = useRouter();

  function handleCardTap(card: TierCardPreview) {
    router.push(`/card/${card.slug}`);
  }

  return (
    <div className="min-h-screen">
      <Header />

      <main className="max-w-2xl mx-auto px-4 py-10">
        {/* Hero */}
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-display text-foreground tracking-tight">
            Browse All Cards
          </h1>
          <p className="text-muted text-sm mt-3 max-w-md mx-auto leading-relaxed">
            Swipe right to save, left to skip. Tap a card for full details.
            Compare your favorites side by side.
          </p>
        </div>

        {/* How it works */}
        <div className="flex justify-center gap-6 mb-8 text-xs text-muted">
          <div className="flex items-center gap-2">
            <span className="w-7 h-7 rounded-full bg-secondary/10 text-secondary flex items-center justify-center text-xs font-bold">
              &#8592;
            </span>
            <span className="font-medium">Skip</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-7 h-7 rounded-full bg-subtle text-muted flex items-center justify-center border border-card-border">
              <Sparkle className="w-3.5 h-3.5" weight="duotone" />
            </span>
            <span className="font-medium">Tap for details</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-7 h-7 rounded-full bg-accent-yellow/10 text-accent-yellow flex items-center justify-center text-xs font-bold">
              &#8594;
            </span>
            <span className="font-medium">Save</span>
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

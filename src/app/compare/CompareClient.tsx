"use client";

import { useState, useEffect } from "react";
import Header from "@/components/Header";
import ComparisonView from "@/components/ComparisonView";
import { useSavedCards } from "@/context/SavedCardsContext";
import { getTierCardsBySlugs } from "@/lib/queries";
import type { TierCard } from "@/lib/types";
import { Loader2 } from "lucide-react";

export default function CompareClient() {
  const { savedCards } = useSavedCards();
  const [cards, setCards] = useState<TierCard[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCards() {
      if (savedCards.length === 0) {
        setCards([]);
        setLoading(false);
        return;
      }

      try {
        const slugs = savedCards.map((s) => s.cardId);
        const data = await getTierCardsBySlugs(slugs);
        setCards(data);
      } catch (err) {
        console.error("Failed to fetch comparison cards:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchCards();
  }, [savedCards]);

  return (
    <div className="min-h-screen">
      <Header />
      <main className="max-w-5xl mx-auto px-4 py-10">
        <div className="mb-10">
          <h1 className="text-2xl font-bold text-foreground">Compare Cards</h1>
          <p className="text-muted text-sm mt-2 leading-relaxed">
            Your saved cards side by side.
          </p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-6 h-6 text-accent animate-spin" />
          </div>
        ) : (
          <ComparisonView cards={cards} />
        )}
      </main>
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";
import Header from "@/components/Header";
import ComparisonView from "@/components/ComparisonView";
import { useSavedCards } from "@/context/SavedCardsContext";
import { getCardsForComparison } from "@/lib/queries";
import type { CardWithDetails } from "@/lib/types";
import { Loader2 } from "lucide-react";

export default function CompareClient() {
  const { savedCards } = useSavedCards();
  const [cards, setCards] = useState<CardWithDetails[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCards() {
      if (savedCards.length === 0) {
        setCards([]);
        setLoading(false);
        return;
      }

      try {
        const ids = savedCards.map((s) => s.cardId);
        const data = await getCardsForComparison(ids);
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
      <main className="max-w-5xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white">Compare Cards</h1>
          <p className="text-zinc-400 text-sm mt-1">
            Your saved cards side by side. Select different tiers to compare.
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

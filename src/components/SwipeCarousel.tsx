"use client";

import { useState, useCallback } from "react";
import { AnimatePresence } from "framer-motion";
import type { CardPreviewData } from "@/lib/types";
import SwipeableCard from "./SwipeableCard";
import { useSavedCards } from "@/context/SavedCardsContext";
import { Heart, RotateCcw, X } from "lucide-react";

interface SwipeCarouselProps {
  cards: CardPreviewData[];
  onCardTap: (card: CardPreviewData) => void;
}

export default function SwipeCarousel({ cards, onCardTap }: SwipeCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [history, setHistory] = useState<number[]>([]);
  const { saveCard, isCardSaved, savedCount } = useSavedCards();

  const visibleCards = cards.slice(currentIndex, currentIndex + 4);

  const handleSwipeLeft = useCallback(() => {
    setHistory((prev) => [...prev, currentIndex]);
    setCurrentIndex((prev) => Math.min(prev + 1, cards.length - 1));
  }, [currentIndex, cards.length]);

  const handleSwipeRight = useCallback(() => {
    const card = cards[currentIndex];
    if (card && !isCardSaved(card.id)) {
      saveCard(card.id);
    }
    setHistory((prev) => [...prev, currentIndex]);
    setCurrentIndex((prev) => Math.min(prev + 1, cards.length - 1));
  }, [currentIndex, cards, saveCard, isCardSaved]);

  const handleUndo = useCallback(() => {
    if (history.length === 0) return;
    const lastIndex = history[history.length - 1];
    setHistory((prev) => prev.slice(0, -1));
    setCurrentIndex(lastIndex);
  }, [history]);

  const handleTap = useCallback(() => {
    const card = cards[currentIndex];
    if (card) onCardTap(card);
  }, [currentIndex, cards, onCardTap]);

  const isFinished = currentIndex >= cards.length;

  return (
    <div className="flex flex-col items-center">
      {/* Saved counter */}
      <div className="flex items-center gap-2 mb-6 text-sm text-zinc-400">
        <Heart className="w-4 h-4 text-success" />
        <span>
          {savedCount} saved
        </span>
        <span className="text-zinc-600">·</span>
        <span>
          {currentIndex + 1} / {cards.length}
        </span>
      </div>

      {/* Card stack area */}
      <div className="relative w-full max-w-sm h-[460px]">
        {isFinished ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="w-16 h-16 rounded-full bg-accent/20 flex items-center justify-center mb-4">
              <Heart className="w-8 h-8 text-accent" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">
              You&apos;ve seen all cards!
            </h3>
            <p className="text-zinc-400 text-sm mb-6">
              {savedCount > 0
                ? `You saved ${savedCount} card${savedCount > 1 ? "s" : ""}. Head to Compare to see them side by side.`
                : "Swipe right on cards you like to save them for comparison."}
            </p>
            <button
              onClick={() => {
                setCurrentIndex(0);
                setHistory([]);
              }}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-accent text-white text-sm font-medium hover:bg-accent-light transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              Start Over
            </button>
          </div>
        ) : (
          <AnimatePresence mode="popLayout">
            {visibleCards.map((card, i) => (
              <SwipeableCard
                key={card.id}
                card={card}
                onSwipeLeft={handleSwipeLeft}
                onSwipeRight={handleSwipeRight}
                onTap={handleTap}
                isTop={i === 0}
                index={i}
              />
            ))}
          </AnimatePresence>
        )}
      </div>

      {/* Action buttons */}
      {!isFinished && (
        <div className="flex items-center gap-4 mt-6">
          <button
            onClick={handleSwipeLeft}
            className="w-14 h-14 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-danger hover:bg-danger/10 transition-colors"
            aria-label="Skip card"
          >
            <X className="w-6 h-6" />
          </button>

          {history.length > 0 && (
            <button
              onClick={handleUndo}
              className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-zinc-400 hover:text-white transition-colors"
              aria-label="Undo last swipe"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          )}

          <button
            onClick={handleSwipeRight}
            className="w-14 h-14 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-success hover:bg-success/10 transition-colors"
            aria-label="Save card"
          >
            <Heart className="w-6 h-6" />
          </button>
        </div>
      )}
    </div>
  );
}

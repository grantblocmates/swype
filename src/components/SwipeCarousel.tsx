"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { TierCardPreview } from "@/lib/types";
import SwipeableCard from "./SwipeableCard";
import CardVisual from "./CardVisual";
import { useSavedCards } from "@/context/SavedCardsContext";
import { Heart, RotateCcw, X } from "lucide-react";
import Link from "next/link";

interface SwipeCarouselProps {
  cards: TierCardPreview[];
  onCardTap: (card: TierCardPreview) => void;
}

export default function SwipeCarousel({ cards, onCardTap }: SwipeCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [history, setHistory] = useState<number[]>([]);
  const [direction, setDirection] = useState(0);
  const { saveCard, isCardSaved, savedCount } = useSavedCards();

  const handleSwipeLeft = useCallback(() => {
    if (currentIndex >= cards.length) return;
    setDirection(-1);
    setHistory((prev) => [...prev, currentIndex]);
    setCurrentIndex((prev) => prev + 1);
  }, [currentIndex, cards.length]);

  const handleSwipeRight = useCallback(() => {
    if (currentIndex >= cards.length) return;
    const card = cards[currentIndex];
    if (card && !isCardSaved(card.slug)) {
      saveCard(card.slug);
    }
    setDirection(1);
    setHistory((prev) => [...prev, currentIndex]);
    setCurrentIndex((prev) => prev + 1);
  }, [currentIndex, cards, saveCard, isCardSaved]);

  const handleUndo = useCallback(() => {
    if (history.length === 0) return;
    const lastIndex = history[history.length - 1];
    setDirection(0);
    setHistory((prev) => prev.slice(0, -1));
    setCurrentIndex(lastIndex);
  }, [history]);

  const handleTap = useCallback(() => {
    const card = cards[currentIndex];
    if (card) onCardTap(card);
  }, [currentIndex, cards, onCardTap]);

  const isFinished = currentIndex >= cards.length;

  // Get previous, current, and next cards for peek effect
  const prevCard = currentIndex > 0 ? cards[currentIndex - 1] : null;
  const currentCard = cards[currentIndex] || null;
  const nextCard = currentIndex < cards.length - 1 ? cards[currentIndex + 1] : null;

  return (
    <div className="flex flex-col items-center">
      {/* Saved counter + progress */}
      <div className="flex items-center gap-3 mb-6 text-sm text-muted">
        <div className="flex items-center gap-1.5">
          <Heart className="w-4 h-4 text-accent" />
          <span className="font-medium">
            {savedCount} saved
          </span>
        </div>
        <span className="text-muted-light">|</span>
        <span className="text-muted-light">
          {Math.min(currentIndex + 1, cards.length)} of {cards.length}
        </span>
      </div>

      {/* Carousel area with peek */}
      <div className="relative w-full overflow-hidden" style={{ minHeight: 500 }}>
        {isFinished ? (
          <div className="flex flex-col items-center justify-center py-16 text-center px-4">
            <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center mb-4">
              <Heart className="w-8 h-8 text-accent" />
            </div>
            <h3 className="text-xl font-bold text-foreground mb-2">
              You&apos;ve seen all cards!
            </h3>
            <p className="text-muted text-sm mb-6 max-w-xs">
              {savedCount > 0
                ? `You saved ${savedCount} card${savedCount > 1 ? "s" : ""}. Head to Compare to see them side by side.`
                : "Swipe right on cards you like to save them for comparison."}
            </p>
            <div className="flex gap-3">
              {savedCount > 0 && (
                <Link
                  href="/compare"
                  className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-accent text-white text-sm font-semibold hover:bg-accent-hover transition-colors"
                >
                  Compare Cards
                </Link>
              )}
              <button
                onClick={() => {
                  setCurrentIndex(0);
                  setHistory([]);
                  setDirection(0);
                }}
                className="flex items-center gap-2 px-5 py-2.5 rounded-full border border-card-border text-muted text-sm font-medium hover:text-foreground hover:border-foreground/30 transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
                Start Over
              </button>
            </div>
          </div>
        ) : (
          <div className="relative flex items-start justify-center" style={{ minHeight: 480 }}>
            {/* Previous card (peek left) */}
            <div className="absolute left-0 top-4 w-[70%] sm:w-[60%] z-0 opacity-40 scale-[0.88] -translate-x-[65%] pointer-events-none transition-all duration-300">
              {prevCard && (
                <div className="bg-card-bg border border-card-border rounded-3xl p-5 shadow-card">
                  <div className="opacity-60">
                    <CardPreviewMini card={prevCard} />
                  </div>
                </div>
              )}
            </div>

            {/* Current card (center, interactive) */}
            <div className="relative z-10 w-full max-w-sm">
              <AnimatePresence mode="wait" custom={direction}>
                {currentCard && (
                  <SwipeableCard
                    key={currentCard.slug}
                    card={currentCard}
                    onSwipeLeft={handleSwipeLeft}
                    onSwipeRight={handleSwipeRight}
                    onTap={handleTap}
                    direction={direction}
                  />
                )}
              </AnimatePresence>
            </div>

            {/* Next card (peek right) */}
            <div className="absolute right-0 top-4 w-[70%] sm:w-[60%] z-0 opacity-40 scale-[0.88] translate-x-[65%] pointer-events-none transition-all duration-300">
              {nextCard && (
                <div className="bg-card-bg border border-card-border rounded-3xl p-5 shadow-card">
                  <div className="opacity-60">
                    <CardPreviewMini card={nextCard} />
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Action buttons */}
      {!isFinished && (
        <div className="flex items-center gap-4 mt-4">
          <motion.button
            onClick={handleSwipeLeft}
            whileTap={{ scale: 0.9 }}
            className="w-16 h-16 rounded-full bg-card-bg border-2 border-card-border flex items-center justify-center text-secondary shadow-card hover:shadow-card-hover hover:border-secondary/30 transition-all"
            aria-label="Skip card"
          >
            <X className="w-7 h-7" />
          </motion.button>

          {history.length > 0 && (
            <motion.button
              onClick={handleUndo}
              whileTap={{ scale: 0.9 }}
              className="w-11 h-11 rounded-full bg-card-bg border border-card-border flex items-center justify-center text-muted shadow-card hover:text-foreground transition-all"
              aria-label="Undo last swipe"
            >
              <RotateCcw className="w-4 h-4" />
            </motion.button>
          )}

          <motion.button
            onClick={handleSwipeRight}
            whileTap={{ scale: 0.9 }}
            className="w-16 h-16 rounded-full bg-accent border-2 border-accent flex items-center justify-center text-white shadow-card hover:shadow-card-hover hover:bg-accent-hover transition-all"
            aria-label="Save card"
          >
            <Heart className="w-7 h-7" />
          </motion.button>
        </div>
      )}
    </div>
  );
}

// Simplified card preview for the peek slots
function CardPreviewMini({ card }: { card: TierCardPreview }) {
  return (
    <div className="w-full">
      <CardVisual
        name={card.displayName}
        issuer={card.issuer}
        card_type={card.card_type}
        card_network={card.card_network}
        custody_model={card.custody_model}
        card_color={card.card_color}
      />
      <div className="mt-3 text-center">
        <p className="text-sm font-semibold text-foreground truncate">{card.displayName}</p>
        <p className="text-xs text-muted">{card.issuer}</p>
      </div>
    </div>
  );
}

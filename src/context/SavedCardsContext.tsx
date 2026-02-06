"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";

interface SavedCard {
  cardId: string;
  tierId?: string;
  savedAt: string;
}

interface SavedCardsContextType {
  savedCards: SavedCard[];
  saveCard: (cardId: string, tierId?: string) => void;
  removeCard: (cardId: string) => void;
  isCardSaved: (cardId: string) => boolean;
  clearAll: () => void;
  savedCount: number;
}

const SavedCardsContext = createContext<SavedCardsContextType | undefined>(undefined);

const STORAGE_KEY = "cardstack_saved_cards";

export function SavedCardsProvider({ children }: { children: React.ReactNode }) {
  const [savedCards, setSavedCards] = useState<SavedCard[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setSavedCards(JSON.parse(stored));
      }
    } catch {}
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(savedCards));
    }
  }, [savedCards, hydrated]);

  const saveCard = useCallback((cardId: string, tierId?: string) => {
    setSavedCards((prev) => {
      if (prev.some((c) => c.cardId === cardId)) return prev;
      return [...prev, { cardId, tierId, savedAt: new Date().toISOString() }];
    });
  }, []);

  const removeCard = useCallback((cardId: string) => {
    setSavedCards((prev) => prev.filter((c) => c.cardId !== cardId));
  }, []);

  const isCardSaved = useCallback(
    (cardId: string) => savedCards.some((c) => c.cardId === cardId),
    [savedCards]
  );

  const clearAll = useCallback(() => {
    setSavedCards([]);
  }, []);

  return (
    <SavedCardsContext.Provider
      value={{
        savedCards,
        saveCard,
        removeCard,
        isCardSaved,
        clearAll,
        savedCount: savedCards.length,
      }}
    >
      {children}
    </SavedCardsContext.Provider>
  );
}

export function useSavedCards() {
  const context = useContext(SavedCardsContext);
  if (!context) {
    throw new Error("useSavedCards must be used within a SavedCardsProvider");
  }
  return context;
}

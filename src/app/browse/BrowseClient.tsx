"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import type { TierCardPreview } from "@/lib/types";
import Header from "@/components/Header";
import ViewToggle, { type BrowseView } from "@/components/ViewToggle";
import BrowseFilters, {
  type FilterState,
  DEFAULT_FILTERS,
} from "@/components/BrowseFilters";
import BrowseListCard from "@/components/BrowseListCard";
import EmptyState from "@/components/EmptyState";
import SwipeCarousel from "@/components/SwipeCarousel";
import { Sparkle } from "@phosphor-icons/react";

interface BrowseClientProps {
  cards: TierCardPreview[];
}

const VIEW_STORAGE_KEY = "swype-browse-view";

export default function BrowseClient({ cards }: BrowseClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // View toggle with localStorage persistence
  const [view, setView] = useState<BrowseView>("list");
  const [filters, setFilters] = useState<FilterState>(() => {
    // Initialize from URL params if present (post-quiz flow)
    const region = searchParams.get("region");
    const cardType = searchParams.get("cardType");
    return {
      ...DEFAULT_FILTERS,
      ...(region ? { region } : {}),
      ...(cardType ? { cardType } : {}),
    };
  });

  // Restore view preference from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(VIEW_STORAGE_KEY);
      if (stored === "list" || stored === "matchmaker") {
        setView(stored);
      }
    } catch {
      // ignore
    }
  }, []);

  const handleViewChange = useCallback((newView: BrowseView) => {
    setView(newView);
    try {
      localStorage.setItem(VIEW_STORAGE_KEY, newView);
    } catch {
      // ignore
    }
  }, []);

  // Filter and sort cards
  const filteredCards = useMemo(() => {
    let result = [...cards];

    // Region filter
    if (filters.region) {
      result = result.filter((c) => {
        if (filters.region === "OTHER") {
          return (
            !c.supported_countries.includes("US") &&
            !c.supported_countries.includes("EU") &&
            !c.supported_countries.includes("UK")
          );
        }
        return (
          c.supported_countries.includes(filters.region!) ||
          c.supported_countries.includes("GLOBAL") ||
          c.supported_countries.length === 0
        );
      });
    }

    // Card type filter
    if (filters.cardType) {
      result = result.filter((c) => c.card_type === filters.cardType);
    }

    // Network filter
    if (filters.network) {
      result = result.filter(
        (c) =>
          c.card_network === filters.network || c.card_network === "both"
      );
    }

    // Staking filter
    if (filters.staking) {
      if (filters.staking === "yes") {
        result = result.filter((c) => c.staking_required);
      } else {
        result = result.filter((c) => !c.staking_required);
      }
    }

    // Sort
    switch (filters.sortBy) {
      case "cashback_high":
        result.sort(
          (a, b) => (b.cashback_percent ?? 0) - (a.cashback_percent ?? 0)
        );
        break;
      case "fee_low":
        result.sort(
          (a, b) => (a.monthly_fee ?? 0) - (b.monthly_fee ?? 0)
        );
        break;
      case "fx_low":
        result.sort(
          (a, b) =>
            (a.fx_markup_percent ?? 99) - (b.fx_markup_percent ?? 99)
        );
        break;
      default:
        // Recommended: use display_order, then tier_order
        result.sort(
          (a, b) =>
            a.display_order - b.display_order ||
            a.tier_order - b.tier_order
        );
    }

    return result;
  }, [cards, filters]);

  function handleCardTap(card: TierCardPreview) {
    router.push(`/card/${card.slug}`);
  }

  function handleClearFilters() {
    setFilters(DEFAULT_FILTERS);
  }

  return (
    <div className="min-h-screen">
      <Header />

      <main className="max-w-4xl mx-auto px-4 py-10">
        {/* Page header with view toggle */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl sm:text-4xl font-display font-extrabold text-dark tracking-[-0.02em]">
              Browse Cards
            </h1>
            <p className="text-muted font-body text-sm mt-1.5 max-w-md leading-relaxed">
              Find the perfect crypto card for your needs.
            </p>
          </div>
          <ViewToggle view={view} onChange={handleViewChange} />
        </div>

        {/* Filters */}
        <div className="mb-6">
          <BrowseFilters
            filters={filters}
            onChange={setFilters}
            resultCount={filteredCards.length}
          />
        </div>

        {/* Content */}
        {view === "list" ? (
          filteredCards.length > 0 ? (
            <div className="space-y-3">
              {filteredCards.map((card, i) => (
                <BrowseListCard key={card.slug} card={card} index={i} />
              ))}
            </div>
          ) : (
            <EmptyState onClearFilters={handleClearFilters} />
          )
        ) : (
          /* Matchmaker view */
          <div className="max-w-2xl mx-auto">
            {/* How it works hints */}
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

            {filteredCards.length > 0 ? (
              <SwipeCarousel
                cards={filteredCards}
                onCardTap={handleCardTap}
              />
            ) : (
              <EmptyState onClearFilters={handleClearFilters} />
            )}
          </div>
        )}
      </main>
    </div>
  );
}

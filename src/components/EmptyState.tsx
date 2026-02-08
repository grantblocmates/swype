"use client";

import Link from "next/link";
import { MagnifyingGlass, FunnelSimple, Sparkle } from "@phosphor-icons/react";

interface EmptyStateProps {
  onClearFilters: () => void;
}

export default function EmptyState({ onClearFilters }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="w-16 h-16 rounded-full bg-subtle flex items-center justify-center mb-5">
        <MagnifyingGlass className="w-7 h-7 text-muted" weight="duotone" />
      </div>

      <h3 className="text-xl font-display font-bold text-dark mb-2">
        No cards match your filters
      </h3>
      <p className="text-sm text-muted font-body max-w-sm mb-6 leading-relaxed">
        Try adjusting or clearing your filters to see more results. Or take our
        quiz to get personalized recommendations.
      </p>

      <div className="flex flex-col sm:flex-row gap-3">
        <button
          onClick={onClearFilters}
          className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-primary text-white text-sm font-body font-semibold hover:brightness-110 transition-all"
        >
          <FunnelSimple className="w-4 h-4" weight="bold" />
          Clear All Filters
        </button>
        <Link
          href="/"
          className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full border border-border bg-surface text-dark text-sm font-body font-medium hover:border-primary/40 transition-all"
        >
          <Sparkle className="w-4 h-4" weight="duotone" />
          Take the Quiz
        </Link>
      </div>
    </div>
  );
}

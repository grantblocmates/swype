"use client";

import { useMemo } from "react";
import Link from "next/link";
import type { TierCardPreview, QuizAnswers } from "@/lib/types";
import { scoreAndFilterCards, type ScoredCard } from "@/lib/quiz-logic";
import CardVisual from "@/components/CardVisual";

import CardTypeBadge from "@/components/CardTypeBadge";
import { useSavedCards } from "@/context/SavedCardsContext";
import {
  ExternalLink,
  Heart,
  Trophy,
  ArrowRight,
  RotateCcw,
  Percent,
  DollarSign,
  ArrowRightLeft,
} from "lucide-react";

interface QuizResultsProps {
  cards: TierCardPreview[];
  answers: QuizAnswers;
}

export default function QuizResults({ cards, answers }: QuizResultsProps) {
  const { saveCard, isCardSaved } = useSavedCards();

  const results: ScoredCard[] = useMemo(() => {
    return scoreAndFilterCards(cards, answers).slice(0, 5);
  }, [cards, answers]);

  function handleSaveTop() {
    for (const r of results.slice(0, 3)) {
      if (!isCardSaved(r.card.slug)) {
        saveCard(r.card.slug);
      }
    }
  }

  if (results.length === 0) {
    return (
      <div className="max-w-lg mx-auto px-4 text-center py-16">
        <h2 className="text-2xl font-bold text-foreground mb-3">
          No exact matches found
        </h2>
        <p className="text-muted text-sm mb-6 leading-relaxed">
          We couldn&apos;t find cards matching all your criteria. Try adjusting
          your preferences or browse all available cards.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/browse"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-accent text-white font-semibold text-sm hover:bg-accent-hover transition-colors"
          >
            Browse All Cards
          </Link>
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full border border-card-border text-muted font-medium text-sm hover:text-foreground hover:border-foreground/30 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            Retake Quiz
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4">
      {/* Header */}
      <div className="text-center mb-10">
        <h1 className="text-3xl sm:text-4xl font-bold text-foreground tracking-tight">
          Your Top Matches
        </h1>
        <p className="text-muted text-sm mt-3 max-w-md mx-auto leading-relaxed">
          Based on your preferences, here are the cards we&apos;d recommend.
        </p>
      </div>

      {/* Result cards */}
      <div className="space-y-4">
        {results.map((result, idx) => (
          <ResultCard
            key={result.card.slug}
            result={result}
            rank={idx + 1}
            isBestMatch={idx === 0}
          />
        ))}
      </div>

      {/* CTAs */}
      <div className="mt-10 flex flex-col sm:flex-row gap-3 justify-center">
        <button
          onClick={handleSaveTop}
          className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-accent text-white font-semibold text-sm hover:bg-accent-hover transition-colors shadow-card"
        >
          Compare Top {Math.min(3, results.length)} Side by Side
          <ArrowRight className="w-4 h-4" />
        </button>
        <Link
          href="/browse"
          className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full border border-card-border text-muted font-medium text-sm hover:text-foreground hover:border-foreground/30 transition-colors"
        >
          Browse All Cards
        </Link>
      </div>

      {/* Retake */}
      <div className="mt-6 text-center">
        <Link
          href="/"
          className="text-sm text-muted hover:text-foreground transition-colors underline underline-offset-4"
        >
          <RotateCcw className="w-3.5 h-3.5 inline mr-1.5" />
          Retake quiz
        </Link>
      </div>
    </div>
  );
}

function ResultCard({
  result,
  isBestMatch,
}: {
  result: ScoredCard;
  rank: number;
  isBestMatch: boolean;
}) {
  const { card, matchReason } = result;
  const { saveCard, removeCard, isCardSaved } = useSavedCards();
  const saved = isCardSaved(card.slug);

  return (
    <div className="bg-card-bg border border-card-border rounded-2xl p-6 shadow-card hover:shadow-card-hover transition-shadow relative">
      {/* Best match badge */}
      {isBestMatch && (
        <div className="absolute -top-3 left-6 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent text-white text-xs font-bold shadow-card">
          <Trophy className="w-3.5 h-3.5" />
          Best Match
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-5">
        {/* Card visual */}
        <div className="w-full sm:w-48 flex-shrink-0">
          <CardVisual
            name={card.displayName}
            issuer={card.issuer}
            card_type={card.card_type}
            card_network={card.card_network}
            custody_model={card.custody_model}
            card_color={card.card_color}
            compact
          />
        </div>

        {/* Card info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-3">
            <div>
              <CardTypeBadge type={card.card_type} />
              <h3 className="text-lg font-bold text-foreground mt-1.5">
                {card.displayName}
              </h3>
              <p className="text-sm text-muted">by {card.issuer}</p>
            </div>
            <button
              onClick={() => saved ? removeCard(card.slug) : saveCard(card.slug)}
              className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center border transition-colors ${
                saved
                  ? "bg-accent/10 border-accent/30 text-accent"
                  : "bg-card-bg border-card-border text-muted hover:text-accent hover:border-accent/30"
              }`}
            >
              <Heart className={`w-5 h-5 ${saved ? "fill-current" : ""}`} />
            </button>
          </div>

          {/* Match reason */}
          <p className="text-sm text-accent font-medium mt-2">{matchReason}</p>

          {/* Key stats */}
          <div className="flex gap-4 mt-3">
            <MiniStat
              icon={<Percent className="w-3 h-3" />}
              label="Cashback"
              value={card.cashback_percent != null ? `${card.cashback_percent}%` : "\u2014"}
            />
            <MiniStat
              icon={<DollarSign className="w-3 h-3" />}
              label="Monthly"
              value={card.monthly_fee === 0 || card.monthly_fee == null ? "Free" : `$${card.monthly_fee}/mo`}
            />
            <MiniStat
              icon={<ArrowRightLeft className="w-3 h-3" />}
              label="FX Fee"
              value={card.fx_markup_percent != null ? `${card.fx_markup_percent}%` : "\u2014"}
            />
          </div>

          {/* Actions */}
          <div className="flex gap-2 mt-4">
            <Link
              href={`/card/${card.slug}`}
              className="text-sm font-medium text-accent hover:text-accent-hover transition-colors"
            >
              Learn more &rarr;
            </Link>
            {card.ref_link && (
              <a
                href={card.ref_link}
                target="_blank"
                rel="noopener noreferrer"
                className="ml-auto inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-accent text-white text-xs font-semibold hover:bg-accent-hover transition-colors"
              >
                <ExternalLink className="w-3 h-3" />
                Sign Up
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function MiniStat({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div>
      <div className="flex items-center gap-1 text-muted mb-0.5">
        {icon}
        <span className="text-[10px] uppercase tracking-wider font-medium">{label}</span>
      </div>
      <p className="text-sm font-bold text-foreground">{value}</p>
    </div>
  );
}

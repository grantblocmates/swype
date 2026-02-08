"use client";

import Link from "next/link";
import Image from "next/image";
import type { TierCardPreview } from "@/lib/types";
import CardTypeBadge from "@/components/CardTypeBadge";
import { useSavedCards } from "@/context/SavedCardsContext";
import {
  Heart,
  ArrowSquareOut,
  Percent,
  CurrencyDollar,
  ArrowsLeftRight,
  Lock,
  Globe,
} from "@phosphor-icons/react";

interface BrowseListCardProps {
  card: TierCardPreview;
}

const networkLabels: Record<string, string> = {
  visa: "Visa",
  mastercard: "Mastercard",
  both: "Visa + MC",
};

export default function BrowseListCard({ card }: BrowseListCardProps) {
  const { saveCard, removeCard, isCardSaved } = useSavedCards();
  const saved = isCardSaved(card.slug);

  return (
    <div className="bg-card border border-card-border rounded-2xl p-4 sm:p-5 shadow-card hover:shadow-card-hover hover:-translate-y-0.5 transition-all group">
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Left: Logo + Identity */}
        <div className="flex items-start gap-3 sm:w-56 flex-shrink-0">
          {/* Logo circle */}
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 border border-card-border"
            style={{
              backgroundColor: card.card_color
                ? `${card.card_color}15`
                : "#f5f5f0",
            }}
          >
            {card.logo_url ? (
              <Image
                src={card.logo_url}
                alt={card.issuer}
                width={28}
                height={28}
                className="w-7 h-7 object-contain"
              />
            ) : (
              <span
                className="text-lg font-bold"
                style={{ color: card.card_color || "#407076" }}
              >
                {card.issuer.charAt(0)}
              </span>
            )}
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-display font-semibold text-foreground truncate">
                {card.displayName}
              </h3>
            </div>
            <p className="text-xs text-muted truncate">{card.issuer}</p>
            <div className="flex items-center gap-1.5 mt-1.5">
              <CardTypeBadge type={card.card_type} size="sm" />
            </div>
          </div>
        </div>

        {/* Center: Key Stats */}
        <div className="flex-1 flex items-center">
          <div className="flex flex-wrap gap-x-5 gap-y-2">
            {/* Cashback */}
            <StatPill
              icon={<Percent className="w-3 h-3" weight="bold" />}
              label="Cashback"
              value={
                card.cashback_percent != null
                  ? `${card.cashback_percent}%`
                  : "\u2014"
              }
              colorClass="bg-accent-emerald/10 text-accent-emerald"
            />
            {/* Monthly fee */}
            <StatPill
              icon={<CurrencyDollar className="w-3 h-3" weight="bold" />}
              label="Monthly"
              value={
                card.monthly_fee === 0 || card.monthly_fee == null
                  ? "Free"
                  : `$${card.monthly_fee}`
              }
              colorClass="bg-accent-sky/10 text-accent-ocean"
            />
            {/* FX fee */}
            <StatPill
              icon={<ArrowsLeftRight className="w-3 h-3" weight="bold" />}
              label="FX Fee"
              value={
                card.fx_markup_percent != null
                  ? `${card.fx_markup_percent}%`
                  : "\u2014"
              }
              colorClass="bg-accent-grape/10 text-accent-lavender"
            />
            {/* Network badge */}
            <div className="flex items-center gap-1 text-xs text-muted">
              <Globe className="w-3 h-3" weight="bold" />
              <span className="font-medium">
                {networkLabels[card.card_network] || card.card_network}
              </span>
            </div>
            {/* Staking tag */}
            {card.staking_required && (
              <div className="flex items-center gap-1 text-xs text-accent-ruby">
                <Lock className="w-3 h-3" weight="bold" />
                <span className="font-medium">
                  Stake{" "}
                  {card.staking_amount != null && card.staking_token
                    ? `${card.staking_amount.toLocaleString()} ${card.staking_token}`
                    : "Required"}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2 sm:flex-shrink-0">
          <button
            onClick={() =>
              saved ? removeCard(card.slug) : saveCard(card.slug)
            }
            className={`w-9 h-9 rounded-full flex items-center justify-center border transition-colors ${
              saved
                ? "bg-accent-yellow/10 border-accent-yellow/30 text-accent-yellow"
                : "bg-card border-card-border text-muted hover:text-accent-yellow hover:border-accent-yellow/30"
            }`}
            aria-label={saved ? "Remove from saved" : "Save card"}
          >
            <Heart
              className="w-4 h-4"
              weight={saved ? "fill" : "bold"}
            />
          </button>
          <Link
            href={`/card/${card.slug}`}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-primary text-white text-xs font-semibold hover:bg-primary-hover transition-colors"
          >
            View
          </Link>
          {card.ref_link && (
            <a
              href={card.ref_link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 px-3 py-2 rounded-full border border-card-border text-xs font-medium text-muted hover:text-foreground hover:border-foreground/20 transition-colors"
            >
              <ArrowSquareOut className="w-3 h-3" weight="bold" />
              Sign Up
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

function StatPill({
  icon,
  label,
  value,
  colorClass,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  colorClass: string;
}) {
  return (
    <div className="flex items-center gap-1.5">
      <div
        className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold ${colorClass}`}
      >
        {icon}
        {value}
      </div>
      <span className="text-[10px] text-muted-light uppercase tracking-wider hidden sm:inline">
        {label}
      </span>
    </div>
  );
}

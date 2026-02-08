"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
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
  index?: number;
}

const networkLabels: Record<string, string> = {
  visa: "Visa",
  mastercard: "Mastercard",
  both: "Visa + MC",
};

// Simple hash to pick an accent colour for the provider initial
const ACCENT_COLORS = [
  { bg: "bg-accent-yellow/15", text: "text-accent-yellow" },
  { bg: "bg-accent-ocean/15", text: "text-accent-ocean" },
  { bg: "bg-accent-emerald/15", text: "text-accent-emerald" },
  { bg: "bg-accent-lavender/15", text: "text-accent-lavender" },
  { bg: "bg-accent-ruby/15", text: "text-accent-ruby" },
  { bg: "bg-accent-grape/15", text: "text-accent-grape" },
];

function hashColor(name: string) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return ACCENT_COLORS[Math.abs(hash) % ACCENT_COLORS.length];
}

export default function BrowseListCard({ card, index = 0 }: BrowseListCardProps) {
  const { saveCard, removeCard, isCardSaved } = useSavedCards();
  const saved = isCardSaved(card.slug);
  const colorScheme = hashColor(card.issuer);

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className="bg-surface rounded-2xl border border-border p-5 sm:p-6 shadow-card hover:shadow-card-hover hover:-translate-y-[2px] hover:border-primary/30 transition-all duration-200 ease-out"
    >
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Left: Logo + Identity */}
        <div className="flex items-start gap-3 sm:w-56 flex-shrink-0">
          {/* Provider avatar */}
          <div
            className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${
              card.logo_url ? "border border-border" : colorScheme.bg
            }`}
            style={card.logo_url ? {
              backgroundColor: card.card_color
                ? `${card.card_color}15`
                : "#f5f5f0",
            } : undefined}
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
              <span className={`text-lg font-display font-bold ${colorScheme.text}`}>
                {card.issuer.charAt(0)}
              </span>
            )}
          </div>
          <div className="min-w-0">
            <h3 className="text-base font-display font-bold text-dark truncate tracking-tight">
              {card.displayName}
            </h3>
            <p className="text-xs text-muted font-body truncate">{card.issuer}</p>
            <div className="mt-1.5">
              <CardTypeBadge type={card.card_type} size="sm" />
            </div>
          </div>
        </div>

        {/* Center: Key Stats */}
        <div className="flex-1 flex items-center">
          <div className="flex flex-wrap gap-x-5 gap-y-2">
            {/* Cashback */}
            <StatPill
              icon={<Percent className="w-3.5 h-3.5" weight="bold" />}
              label="Cashback"
              value={
                card.cashback_percent != null
                  ? `${card.cashback_percent}%`
                  : "\u2014"
              }
              colorClass="bg-accent-emerald/12 text-accent-emerald"
            />
            {/* Monthly fee */}
            <StatPill
              icon={<CurrencyDollar className="w-3.5 h-3.5" weight="bold" />}
              label="Monthly"
              value={
                card.monthly_fee === 0 || card.monthly_fee == null
                  ? "Free"
                  : `$${card.monthly_fee}`
              }
              colorClass="bg-accent-sky/12 text-accent-ocean"
            />
            {/* FX fee */}
            <StatPill
              icon={<ArrowsLeftRight className="w-3.5 h-3.5" weight="bold" />}
              label="FX Fee"
              value={
                card.fx_markup_percent != null
                  ? `${card.fx_markup_percent}%`
                  : "\u2014"
              }
              colorClass="bg-accent-lavender/12 text-accent-lavender"
            />
            {/* Network */}
            <div className="flex items-center gap-1 text-xs text-muted font-body">
              <Globe className="w-3.5 h-3.5" weight="bold" />
              <span className="font-medium">
                {networkLabels[card.card_network] || card.card_network}
              </span>
            </div>
            {/* Staking tag */}
            {card.staking_required && (
              <div className="flex items-center gap-1 text-xs text-accent-ruby font-body">
                <Lock className="w-3.5 h-3.5" weight="bold" />
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
          <motion.button
            onClick={() =>
              saved ? removeCard(card.slug) : saveCard(card.slug)
            }
            whileTap={{ scale: 1.15 }}
            transition={{ type: "spring", stiffness: 400, damping: 15 }}
            className={`w-10 h-10 rounded-xl flex items-center justify-center border transition-all duration-200 ${
              saved
                ? "bg-accent-ruby/12 border-accent-ruby/30 text-accent-ruby"
                : "bg-surface border-border text-muted hover:border-primary/40"
            }`}
            aria-label={saved ? "Remove from saved" : "Save card"}
          >
            <Heart
              className="w-[18px] h-[18px]"
              weight={saved ? "fill" : "bold"}
            />
          </motion.button>
          <Link
            href={`/card/${card.slug}`}
            className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl bg-primary text-white text-xs font-body font-semibold hover:brightness-110 transition-all"
          >
            View
          </Link>
          {card.ref_link && (
            <a
              href={card.ref_link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 px-5 py-2 rounded-xl border border-border text-xs font-body font-medium text-dark hover:border-primary/40 transition-all"
            >
              <ArrowSquareOut className="w-3.5 h-3.5" weight="bold" />
              Sign Up
            </a>
          )}
        </div>
      </div>
    </motion.div>
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
        className={`flex items-center gap-1 px-2.5 py-1 rounded-full font-display font-bold text-sm ${colorClass}`}
      >
        {icon}
        {value}
      </div>
      <span className="text-[10px] text-muted font-body font-medium uppercase tracking-wider hidden sm:inline">
        {label}
      </span>
    </div>
  );
}

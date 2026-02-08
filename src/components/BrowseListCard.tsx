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

const ACCENT_COLORS = [
  { bg: "#FFB500", text: "text-white" },
  { bg: "#4E76D0", text: "text-white" },
  { bg: "#00936D", text: "text-white" },
  { bg: "#4F467F", text: "text-white" },
  { bg: "#FC6E48", text: "text-white" },
  { bg: "#8885D2", text: "text-white" },
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
      transition={{ duration: 0.3, delay: index * 0.04 }}
      className="bg-white rounded-3xl border border-border shadow-card hover:shadow-card-hover hover:-translate-y-[2px] hover:border-border-strong transition-all duration-200 ease-out"
      style={{ padding: "20px 24px" }}
    >
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Left: Logo + Identity */}
        <div className="flex items-start gap-3 sm:w-56 flex-shrink-0">
          {/* Provider avatar - slightly squared like Notion */}
          <div
            className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0"
            style={{
              background: card.logo_url
                ? (card.card_color ? `${card.card_color}15` : "#f5f5f0")
                : `linear-gradient(135deg, ${colorScheme.bg}ee, ${colorScheme.bg}bb)`,
              border: card.logo_url ? "1px solid rgba(0,0,0,0.06)" : "none",
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
            <StatPill
              label="Cashback"
              value={
                card.cashback_percent != null
                  ? `${card.cashback_percent}%`
                  : "\u2014"
              }
              colorClass="bg-accent-emerald/[0.08] text-accent-emerald border-accent-emerald/10"
            />
            <StatPill
              label="Monthly"
              value={
                card.monthly_fee === 0 || card.monthly_fee == null
                  ? "Free"
                  : `$${card.monthly_fee}`
              }
              colorClass="bg-accent-sky/[0.08] text-accent-ocean border-accent-sky/10"
            />
            <StatPill
              label="FX Fee"
              value={
                card.fx_markup_percent != null
                  ? `${card.fx_markup_percent}%`
                  : "\u2014"
              }
              colorClass="bg-accent-lavender/[0.08] text-accent-lavender border-accent-lavender/10"
            />
            <div className="flex items-center gap-1 text-xs text-muted font-body">
              <Globe className="w-3.5 h-3.5" weight="bold" />
              <span className="font-medium">
                {networkLabels[card.card_network] || card.card_network}
              </span>
            </div>
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
            whileTap={{ scale: 1.1 }}
            transition={{ duration: 0.2 }}
            className={`w-[42px] h-[42px] rounded-2xl flex items-center justify-center border transition-all duration-200 ${
              saved
                ? "bg-accent-ruby/10 border-accent-ruby/20 text-accent-ruby"
                : "bg-white border-border text-muted hover:border-border-hover"
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
            className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-2xl bg-primary text-white text-xs font-display font-semibold hover:brightness-110 hover:shadow-card transition-all"
          >
            View
          </Link>
          {card.ref_link && (
            <a
              href={card.ref_link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 px-5 py-2.5 rounded-2xl bg-white border border-border-strong text-xs font-body font-medium text-dark hover:border-border-hover hover:shadow-card transition-all"
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
  label,
  value,
  colorClass,
}: {
  label: string;
  value: string;
  colorClass: string;
}) {
  return (
    <div className="flex items-center gap-1.5">
      <div
        className={`flex items-center gap-1 px-3 py-1 rounded-full font-display font-bold text-sm border ${colorClass}`}
      >
        {value}
      </div>
      <span className="text-[10px] text-muted font-body font-medium uppercase tracking-wider hidden sm:inline">
        {label}
      </span>
    </div>
  );
}

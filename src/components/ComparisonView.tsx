"use client";

import { useState, useEffect } from "react";
import type { CardWithDetails, TierWithDetails } from "@/lib/types";
import CardVisual from "./CardVisual";
import TierSelector from "./TierSelector";
import ChainBadge from "./ChainBadge";
import CardTypeBadge from "./CardTypeBadge";
import { useSavedCards } from "@/context/SavedCardsContext";
import { X, ExternalLink } from "lucide-react";

interface ComparisonViewProps {
  cards: CardWithDetails[];
}

function bestValue(
  values: (number | null | undefined)[],
  lower: boolean
): number | null {
  const nums = values.filter((v): v is number => v != null);
  if (nums.length === 0) return null;
  return lower ? Math.min(...nums) : Math.max(...nums);
}

export default function ComparisonView({ cards }: ComparisonViewProps) {
  const { removeCard } = useSavedCards();
  const [selectedTiers, setSelectedTiers] = useState<Record<string, string>>(
    {}
  );

  useEffect(() => {
    const initial: Record<string, string> = {};
    cards.forEach((card) => {
      const defaultTier =
        card.tiers.find((t) => t.is_default) || card.tiers[0];
      if (defaultTier) initial[card.id] = defaultTier.id;
    });
    setSelectedTiers(initial);
  }, [cards]);

  function getSelectedTier(
    card: CardWithDetails
  ): TierWithDetails | undefined {
    return card.tiers.find((t) => t.id === selectedTiers[card.id]) || card.tiers[0];
  }

  if (cards.length === 0) {
    return (
      <div className="text-center py-20">
        <p className="text-zinc-400 text-lg">No cards to compare.</p>
        <p className="text-zinc-500 text-sm mt-2">
          Swipe right on cards in Browse to save them for comparison.
        </p>
      </div>
    );
  }

  const tiers = cards.map((c) => getSelectedTier(c));
  const fees = tiers.map((t) => t?.fees);
  const rewards = tiers.map((t) => t?.rewards);

  // Determine best values
  const bestMonthly = bestValue(
    tiers.map((t) => t?.monthly_fee),
    true
  );
  const bestCashback = bestValue(
    rewards.map((r) => r?.cashback_percent),
    false
  );
  const bestFx = bestValue(
    fees.map((f) => f?.fx_markup_percent),
    true
  );

  return (
    <div className="overflow-x-auto no-scrollbar pb-8">
      <div
        className="grid gap-4 min-w-max"
        style={{
          gridTemplateColumns: `repeat(${cards.length}, minmax(280px, 1fr))`,
        }}
      >
        {cards.map((card, i) => {
          const tier = tiers[i];
          const fee = fees[i];
          const reward = rewards[i];

          return (
            <div
              key={card.id}
              className="bg-card-bg border border-card-border rounded-2xl p-4 relative"
            >
              {/* Remove button */}
              <button
                onClick={() => removeCard(card.id)}
                className="absolute top-3 right-3 w-7 h-7 rounded-full bg-white/5 flex items-center justify-center text-zinc-500 hover:text-danger hover:bg-danger/10 transition-colors z-10"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Card visual */}
              <div className="mb-3">
                <CardVisual
                  name={card.name}
                  issuer={card.issuer}
                  card_type={card.card_type}
                  card_network={card.card_network}
                  custody_model={card.custody_model}
                  card_color={tier?.card_color}
                  compact
                />
              </div>

              {/* Tier selector */}
              <div className="mb-4">
                <TierSelector
                  tiers={card.tiers}
                  selectedTierId={selectedTiers[card.id] || ""}
                  onSelect={(id) =>
                    setSelectedTiers((prev) => ({ ...prev, [card.id]: id }))
                  }
                />
              </div>

              {/* Comparison rows */}
              <div className="space-y-0.5">
                <CompRow
                  label="Card Type"
                  value={<CardTypeBadge type={card.card_type} />}
                />
                <CompRow
                  label="Monthly Fee"
                  value={
                    tier?.monthly_fee === 0
                      ? "Free"
                      : `$${tier?.monthly_fee || 0}/mo`
                  }
                  isBest={tier?.monthly_fee === bestMonthly}
                />
                <CompRow
                  label="Cashback"
                  value={
                    reward?.cashback_percent != null
                      ? `${reward.cashback_percent}%`
                      : "—"
                  }
                  isBest={reward?.cashback_percent === bestCashback}
                />
                <CompRow
                  label="FX Markup"
                  value={
                    fee?.fx_markup_percent != null
                      ? fee.fx_markup_percent === 0
                        ? "Free"
                        : `${fee.fx_markup_percent}%`
                      : "—"
                  }
                  isBest={fee?.fx_markup_percent === bestFx}
                />
                <CompRow
                  label="ATM Fee"
                  value={
                    fee?.atm_fee_domestic != null
                      ? fee.atm_fee_domestic === 0
                        ? "Free"
                        : `$${fee.atm_fee_domestic}`
                      : "—"
                  }
                />
                <CompRow
                  label="Custody"
                  value={
                    card.custody_model?.replace("_", " ") || "Custodial"
                  }
                />
                <CompRow
                  label="Chains"
                  value={
                    card.supported_chains.length > 0 ? (
                      <div className="flex flex-wrap gap-1">
                        {card.supported_chains.map((c) => (
                          <ChainBadge key={c} chain={c} />
                        ))}
                      </div>
                    ) : (
                      "—"
                    )
                  }
                />
                <CompRow
                  label="KYC"
                  value={card.kyc_required ? "Required" : "Not required"}
                />
                <CompRow
                  label="Mobile Pay"
                  value={
                    [
                      card.apple_pay && "Apple",
                      card.google_pay && "Google",
                    ]
                      .filter(Boolean)
                      .join(", ") || "—"
                  }
                />
              </div>

              {/* CTA */}
              {card.ref_link && (
                <a
                  href={card.ref_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 flex items-center justify-center gap-2 w-full px-4 py-2.5 rounded-xl bg-accent text-white text-sm font-semibold hover:bg-accent-light transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                  Sign Up
                </a>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function CompRow({
  label,
  value,
  isBest,
}: {
  label: string;
  value: React.ReactNode;
  isBest?: boolean;
}) {
  return (
    <div className="flex items-center justify-between py-2.5 border-b border-white/5 last:border-0">
      <span className="text-xs text-zinc-500 uppercase tracking-wider">
        {label}
      </span>
      <span
        className={`text-sm font-medium ${
          isBest ? "text-success" : "text-white"
        }`}
      >
        {value}
      </span>
    </div>
  );
}

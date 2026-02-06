"use client";

import { useState, useEffect } from "react";
import type { CardWithDetails, TierWithDetails } from "@/lib/types";
import CardVisual from "./CardVisual";
import ChainBadge from "./ChainBadge";
import CardTypeBadge from "./CardTypeBadge";
import { useSavedCards } from "@/context/SavedCardsContext";
import { X, ExternalLink, ChevronDown } from "lucide-react";
import Link from "next/link";

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

function formatCurrency(val: number | null | undefined, suffix = ""): string {
  if (val == null) return "\u2014";
  if (val === 0) return "Free";
  return `$${val}${suffix}`;
}

function formatPercent(val: number | null | undefined): string {
  if (val == null) return "\u2014";
  if (val === 0) return "Free";
  return `${val}%`;
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
    return (
      card.tiers.find((t) => t.id === selectedTiers[card.id]) || card.tiers[0]
    );
  }

  if (cards.length === 0) {
    return (
      <div className="text-center py-20">
        <p className="text-foreground text-lg font-medium">
          No cards to compare.
        </p>
        <p className="text-muted text-sm mt-2">
          Swipe right on cards in Browse to save them for comparison.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 mt-4 px-5 py-2.5 rounded-full bg-accent text-white text-sm font-semibold hover:bg-accent-hover transition-colors"
        >
          Browse Cards
        </Link>
      </div>
    );
  }

  const tiers = cards.map((c) => getSelectedTier(c));
  const fees = tiers.map((t) => t?.fees);
  const rewards = tiers.map((t) => t?.rewards);

  // Compute best values for highlighting
  const bestMonthly = bestValue(
    tiers.map((t) => t?.monthly_fee),
    true
  );
  const bestAnnual = bestValue(
    tiers.map((t) => t?.annual_fee),
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
  const bestAtm = bestValue(
    fees.map((f) => f?.atm_fee_domestic),
    true
  );

  // Build comparison rows
  type RowDef = {
    label: string;
    values: React.ReactNode[];
    bestFlags: boolean[];
  };

  const rows: RowDef[] = [
    {
      label: "Card Type",
      values: cards.map((c) => <CardTypeBadge key={c.id} type={c.card_type} />),
      bestFlags: cards.map(() => false),
    },
    {
      label: "Monthly Cost",
      values: tiers.map((t) => formatCurrency(t?.monthly_fee, "/mo")),
      bestFlags: tiers.map((t) => t?.monthly_fee === bestMonthly),
    },
    {
      label: "Annual Fee",
      values: tiers.map((t) => formatCurrency(t?.annual_fee, "/yr")),
      bestFlags: tiers.map((t) => t?.annual_fee === bestAnnual),
    },
    {
      label: "Min Stake",
      values: tiers.map((t) => {
        if (!t?.staking_required) return "\u2014";
        if (t.staking_amount && t.staking_token) {
          return `${t.staking_amount.toLocaleString()} ${t.staking_token}`;
        }
        return "Required";
      }),
      bestFlags: tiers.map(() => false),
    },
    {
      label: "Cashback",
      values: rewards.map((r) => formatPercent(r?.cashback_percent)),
      bestFlags: rewards.map((r) => r?.cashback_percent === bestCashback),
    },
    {
      label: "FX Markup",
      values: fees.map((f) => formatPercent(f?.fx_markup_percent)),
      bestFlags: fees.map((f) => f?.fx_markup_percent === bestFx),
    },
    {
      label: "ATM Fee",
      values: fees.map((f) => formatCurrency(f?.atm_fee_domestic)),
      bestFlags: fees.map((f) => f?.atm_fee_domestic === bestAtm),
    },
    {
      label: "Chains",
      values: cards.map((c) =>
        c.supported_chains.length > 0 ? (
          <div key={c.id} className="flex flex-wrap gap-1">
            {c.supported_chains.map((ch) => (
              <ChainBadge key={ch} chain={ch} />
            ))}
          </div>
        ) : (
          "\u2014"
        )
      ),
      bestFlags: cards.map(() => false),
    },
    {
      label: "Custody",
      values: cards.map(
        (c) => c.custody_model?.replace("_", " ") || "Custodial"
      ),
      bestFlags: cards.map(() => false),
    },
    {
      label: "KYC",
      values: cards.map((c) =>
        c.kyc_required ? "Required" : "Not required"
      ),
      bestFlags: cards.map(() => false),
    },
    {
      label: "Mobile Pay",
      values: cards.map((c) => {
        const pays = [
          c.apple_pay && "Apple",
          c.google_pay && "Google",
        ].filter(Boolean);
        return pays.length > 0 ? pays.join(", ") : "\u2014";
      }),
      bestFlags: cards.map(() => false),
    },
  ];

  return (
    <div className="overflow-x-auto no-scrollbar pb-4 -mx-4 px-4">
      <table className="w-full border-collapse" style={{ minWidth: `${cards.length * 240 + 120}px` }}>
        {/* Column headers: card visuals + tier selectors */}
        <thead>
          <tr>
            {/* Label column header */}
            <th className="sticky left-0 z-10 bg-background p-2 w-[120px] min-w-[120px]" />

            {cards.map((card) => (
              <th
                key={card.id}
                className="p-3 align-top text-left min-w-[220px]"
              >
                <div className="bg-card-bg border border-card-border rounded-2xl p-4 shadow-card relative">
                  {/* Remove button */}
                  <button
                    onClick={() => removeCard(card.id)}
                    className="absolute top-2.5 right-2.5 w-6 h-6 rounded-full bg-subtle flex items-center justify-center text-muted hover:text-secondary hover:bg-secondary/10 transition-colors z-10"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>

                  {/* Mini card visual */}
                  <div className="mb-3 pr-6">
                    <CardVisual
                      name={card.name}
                      issuer={card.issuer}
                      card_type={card.card_type}
                      card_network={card.card_network}
                      custody_model={card.custody_model}
                      card_color={getSelectedTier(card)?.card_color}
                      compact
                    />
                  </div>

                  {/* Tier dropdown */}
                  {card.tiers.length > 1 && (
                    <div className="relative">
                      <select
                        value={selectedTiers[card.id] || ""}
                        onChange={(e) =>
                          setSelectedTiers((prev) => ({
                            ...prev,
                            [card.id]: e.target.value,
                          }))
                        }
                        className="w-full appearance-none bg-subtle border border-card-border rounded-xl px-3 py-2 pr-8 text-sm font-medium text-foreground cursor-pointer focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-colors"
                      >
                        {card.tiers.map((tier) => (
                          <option key={tier.id} value={tier.id}>
                            {tier.name}
                            {(tier.monthly_fee ?? 0) > 0
                              ? ` — $${tier.monthly_fee}/mo`
                              : ""}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted pointer-events-none" />
                    </div>
                  )}

                  {/* Single tier label */}
                  {card.tiers.length === 1 && card.tiers[0] && (
                    <div className="px-3 py-2 bg-subtle rounded-xl text-sm font-medium text-foreground">
                      {card.tiers[0].name}
                    </div>
                  )}

                  {/* CTA */}
                  {card.ref_link && (
                    <a
                      href={card.ref_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-3 flex items-center justify-center gap-1.5 w-full px-3 py-2 rounded-xl bg-accent text-white text-xs font-semibold hover:bg-accent-hover transition-colors"
                    >
                      <ExternalLink className="w-3 h-3" />
                      Sign Up
                    </a>
                  )}
                </div>
              </th>
            ))}
          </tr>
        </thead>

        {/* Data rows */}
        <tbody>
          {rows.map((row, rowIdx) => (
            <tr
              key={row.label}
              className={rowIdx % 2 === 0 ? "bg-subtle/50" : ""}
            >
              {/* Row label */}
              <td className="sticky left-0 z-10 px-2 py-3 text-xs font-semibold uppercase tracking-wider text-muted whitespace-nowrap bg-inherit">
                <div className={`${rowIdx % 2 === 0 ? "bg-subtle/50" : "bg-background"} -mx-2 px-2 py-3 -my-3`}>
                  {row.label}
                </div>
              </td>

              {row.values.map((val, colIdx) => (
                <td
                  key={cards[colIdx].id}
                  className={`px-3 py-3 text-sm font-medium min-w-[220px] ${
                    row.bestFlags[colIdx]
                      ? "text-accent font-semibold"
                      : "text-foreground"
                  }`}
                >
                  <div
                    className={`rounded-lg px-3 py-2 ${
                      row.bestFlags[colIdx]
                        ? "bg-accent/8 border border-accent/15"
                        : ""
                    }`}
                  >
                    {val}
                  </div>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

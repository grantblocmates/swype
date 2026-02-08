"use client";

import type { TierCard } from "@/lib/types";
import CardVisual from "./CardVisual";
import ChainBadge from "./ChainBadge";
import CardTypeBadge from "./CardTypeBadge";
import { useSavedCards } from "@/context/SavedCardsContext";
import { X, ArrowSquareOut } from "@phosphor-icons/react";
import Link from "next/link";

interface ComparisonViewProps {
  cards: TierCard[];
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

  if (cards.length === 0) {
    return (
      <div className="text-center py-20">
        <p className="text-foreground text-lg font-display">
          No cards to compare.
        </p>
        <p className="text-muted text-sm mt-2">
          Swipe right on cards in Browse to save them, or take the quiz for recommendations.
        </p>
        <div className="flex gap-3 justify-center mt-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-primary text-white text-sm font-semibold hover:bg-primary-hover transition-colors"
          >
            Take the Quiz
          </Link>
          <Link
            href="/browse"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-card-border text-muted text-sm font-medium hover:text-foreground hover:border-foreground/30 transition-colors"
          >
            Browse Cards
          </Link>
        </div>
      </div>
    );
  }

  const fees = cards.map((c) => c.fees);
  const rewards = cards.map((c) => c.rewards);

  const bestMonthly = bestValue(cards.map((c) => c.monthly_fee), true);
  const bestAnnual = bestValue(cards.map((c) => c.annual_fee), true);
  const bestCashback = bestValue(rewards.map((r) => r?.cashback_percent), false);
  const bestFx = bestValue(fees.map((f) => f?.fx_markup_percent), true);
  const bestAtm = bestValue(fees.map((f) => f?.atm_fee_domestic), true);

  type RowDef = {
    label: string;
    values: React.ReactNode[];
    bestFlags: boolean[];
  };

  const rows: RowDef[] = [
    {
      label: "Card Type",
      values: cards.map((c) => <CardTypeBadge key={c.slug} type={c.card_type} />),
      bestFlags: cards.map(() => false),
    },
    {
      label: "Monthly Cost",
      values: cards.map((c) => formatCurrency(c.monthly_fee, "/mo")),
      bestFlags: cards.map((c) => c.monthly_fee === bestMonthly),
    },
    {
      label: "Annual Fee",
      values: cards.map((c) => formatCurrency(c.annual_fee, "/yr")),
      bestFlags: cards.map((c) => c.annual_fee === bestAnnual),
    },
    {
      label: "Min Stake",
      values: cards.map((c) => {
        if (!c.staking_required) return "\u2014";
        if (c.staking_amount && c.staking_token) {
          return `${c.staking_amount.toLocaleString()} ${c.staking_token}`;
        }
        return "Required";
      }),
      bestFlags: cards.map(() => false),
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
          <div key={c.slug} className="flex flex-wrap gap-1">
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
      values: cards.map((c) => c.custody_model?.replace("_", " ") || "Custodial"),
      bestFlags: cards.map(() => false),
    },
    {
      label: "Mobile Pay",
      values: cards.map((c) => {
        const pays = [c.apple_pay && "Apple", c.google_pay && "Google"].filter(Boolean);
        return pays.length > 0 ? pays.join(", ") : "\u2014";
      }),
      bestFlags: cards.map(() => false),
    },
    {
      label: "KYC",
      values: cards.map((c) => (c.kyc_required ? "Required" : "Not required")),
      bestFlags: cards.map(() => false),
    },
    {
      label: "Network",
      values: cards.map((c) =>
        c.card_network === "both"
          ? "Visa / MC"
          : c.card_network.charAt(0).toUpperCase() + c.card_network.slice(1)
      ),
      bestFlags: cards.map(() => false),
    },
  ];

  return (
    <div className="overflow-x-auto no-scrollbar pb-4 -mx-4 px-4">
      <table
        className="w-full border-collapse"
        style={{ minWidth: `${cards.length * 240 + 120}px` }}
      >
        <thead>
          <tr>
            <th className="sticky left-0 z-10 bg-background p-2 w-[120px] min-w-[120px]" />
            {cards.map((card) => (
              <th key={card.slug} className="p-3 align-top text-left min-w-[220px]">
                <div className="bg-card-bg border border-card-border rounded-2xl p-4 shadow-card relative">
                  <button
                    onClick={() => removeCard(card.slug)}
                    className="absolute top-2.5 right-2.5 w-6 h-6 rounded-full bg-subtle flex items-center justify-center text-muted hover:text-secondary hover:bg-secondary/10 transition-colors z-10"
                  >
                    <X className="w-3.5 h-3.5" weight="bold" />
                  </button>

                  <div className="mb-3 pr-6">
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

                  <h3 className="text-sm font-display text-foreground truncate">
                    {card.displayName}
                  </h3>
                  <p className="text-xs text-muted mt-0.5">{card.issuer}</p>

                  {card.ref_link && (
                    <a
                      href={card.ref_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-3 flex items-center justify-center gap-1.5 w-full px-3 py-2 rounded-full bg-primary text-white text-xs font-semibold hover:bg-primary-hover transition-colors"
                    >
                      <ArrowSquareOut className="w-3 h-3" weight="bold" />
                      Sign Up
                    </a>
                  )}
                </div>
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {rows.map((row, rowIdx) => (
            <tr key={row.label} className={rowIdx % 2 === 0 ? "bg-subtle/50" : ""}>
              <td className="sticky left-0 z-10 px-2 py-3 text-xs font-semibold uppercase tracking-wider text-muted whitespace-nowrap bg-inherit font-body">
                <div
                  className={`${rowIdx % 2 === 0 ? "bg-subtle/50" : "bg-background"} -mx-2 px-2 py-3 -my-3`}
                >
                  {row.label}
                </div>
              </td>
              {row.values.map((val, colIdx) => (
                <td
                  key={cards[colIdx].slug}
                  className={`px-3 py-3 text-sm font-medium min-w-[220px] ${
                    row.bestFlags[colIdx] ? "text-accent-emerald font-semibold" : "text-foreground"
                  }`}
                >
                  <div
                    className={`rounded-lg px-3 py-2 ${
                      row.bestFlags[colIdx] ? "bg-accent-emerald/10 border-l-2 border-accent-emerald" : ""
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

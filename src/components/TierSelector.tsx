"use client";

import type { TierWithDetails } from "@/lib/types";

interface TierSelectorProps {
  tiers: TierWithDetails[];
  selectedTierId: string;
  onSelect: (tierId: string) => void;
}

export default function TierSelector({
  tiers,
  selectedTierId,
  onSelect,
}: TierSelectorProps) {
  if (tiers.length <= 1) return null;

  return (
    <div className="flex gap-1 p-1 bg-white/5 rounded-xl overflow-x-auto no-scrollbar">
      {tiers.map((tier) => {
        const isSelected = tier.id === selectedTierId;
        return (
          <button
            key={tier.id}
            onClick={() => onSelect(tier.id)}
            className={`flex-shrink-0 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              isSelected
                ? "bg-accent text-white shadow-lg"
                : "text-zinc-400 hover:text-white hover:bg-white/5"
            }`}
          >
            {tier.name}
            {(tier.monthly_fee ?? 0) > 0 && (
              <span className="ml-1.5 text-xs opacity-70">
                ${tier.monthly_fee}/mo
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}

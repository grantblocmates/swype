import type { Perk, PerkCategory } from "@/lib/types";
import {
  Shield,
  Plane,
  Tv,
  TrendingUp,
  Coins,
  ArrowRightLeft,
  Eye,
  Headphones,
  Star,
} from "lucide-react";

const categoryConfig: Record<
  PerkCategory,
  { label: string; icon: React.ReactNode }
> = {
  insurance: { label: "Insurance", icon: <Shield className="w-4 h-4" /> },
  lounge_access: {
    label: "Lounge Access",
    icon: <Plane className="w-4 h-4" />,
  },
  subscriptions: {
    label: "Subscriptions",
    icon: <Tv className="w-4 h-4" />,
  },
  yield: { label: "Yield", icon: <TrendingUp className="w-4 h-4" /> },
  defi_feature: { label: "DeFi", icon: <Coins className="w-4 h-4" /> },
  transfers: {
    label: "Transfers",
    icon: <ArrowRightLeft className="w-4 h-4" />,
  },
  privacy: { label: "Privacy", icon: <Eye className="w-4 h-4" /> },
  concierge: {
    label: "Concierge",
    icon: <Headphones className="w-4 h-4" />,
  },
  other: { label: "Other", icon: <Star className="w-4 h-4" /> },
};

interface PerksListProps {
  perks: Perk[];
}

export default function PerksList({ perks }: PerksListProps) {
  if (perks.length === 0) {
    return (
      <p className="text-sm text-zinc-500 italic">
        No perks information available.
      </p>
    );
  }

  // Group perks by category
  const grouped = perks.reduce(
    (acc, perk) => {
      const cat = perk.perk_category;
      if (!acc[cat]) acc[cat] = [];
      acc[cat].push(perk);
      return acc;
    },
    {} as Record<string, Perk[]>
  );

  return (
    <div className="space-y-4">
      {Object.entries(grouped).map(([category, categoryPerks]) => {
        const config =
          categoryConfig[category as PerkCategory] || categoryConfig.other;
        return (
          <div key={category}>
            <div className="flex items-center gap-2 mb-2 text-zinc-400">
              {config.icon}
              <h4 className="text-xs font-semibold uppercase tracking-wider">
                {config.label}
              </h4>
            </div>
            <div className="space-y-2">
              {categoryPerks.map((perk) => (
                <div
                  key={perk.id}
                  className="p-3 rounded-lg bg-white/5 border border-white/5"
                >
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-sm font-medium text-white">
                      {perk.perk_name}
                    </p>
                    {perk.perk_value && (
                      <span className="text-xs font-medium text-accent flex-shrink-0">
                        {perk.perk_value}
                      </span>
                    )}
                  </div>
                  {perk.perk_description && (
                    <p className="text-xs text-zinc-400 mt-1">
                      {perk.perk_description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

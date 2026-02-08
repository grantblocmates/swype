import type { Perk, PerkCategory } from "@/lib/types";
import {
  Shield,
  AirplaneTilt,
  Television,
  TrendUp,
  Coins,
  ArrowsLeftRight,
  Eye,
  Headset,
  Star,
} from "@phosphor-icons/react";

const categoryColors: Record<PerkCategory, string> = {
  insurance: "text-accent-ocean",
  lounge_access: "text-accent-lavender",
  subscriptions: "text-accent-grape",
  yield: "text-accent-emerald",
  defi_feature: "text-accent-forest",
  transfers: "text-accent-sky",
  privacy: "text-accent-ruby",
  concierge: "text-accent-yellow",
  other: "text-accent-pink",
};

const categoryConfig: Record<
  PerkCategory,
  { label: string; icon: React.ReactNode }
> = {
  insurance: { label: "Insurance", icon: <Shield className="w-4 h-4" weight="duotone" /> },
  lounge_access: {
    label: "Lounge Access",
    icon: <AirplaneTilt className="w-4 h-4" weight="duotone" />,
  },
  subscriptions: {
    label: "Subscriptions",
    icon: <Television className="w-4 h-4" weight="duotone" />,
  },
  yield: { label: "Yield", icon: <TrendUp className="w-4 h-4" weight="duotone" /> },
  defi_feature: { label: "DeFi", icon: <Coins className="w-4 h-4" weight="duotone" /> },
  transfers: {
    label: "Transfers",
    icon: <ArrowsLeftRight className="w-4 h-4" weight="duotone" />,
  },
  privacy: { label: "Privacy", icon: <Eye className="w-4 h-4" weight="duotone" /> },
  concierge: {
    label: "Concierge",
    icon: <Headset className="w-4 h-4" weight="duotone" />,
  },
  other: { label: "Other", icon: <Star className="w-4 h-4" weight="duotone" /> },
};

interface PerksListProps {
  perks: Perk[];
}

export default function PerksList({ perks }: PerksListProps) {
  if (perks.length === 0) {
    return (
      <p className="text-sm text-muted italic">
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
        const colorClass =
          categoryColors[category as PerkCategory] || categoryColors.other;
        return (
          <div key={category}>
            <div className={`flex items-center gap-2 mb-2 ${colorClass}`}>
              {config.icon}
              <h4 className="text-xs font-semibold uppercase tracking-wider">
                {config.label}
              </h4>
            </div>
            <div className="space-y-2">
              {categoryPerks.map((perk) => (
                <div
                  key={perk.id}
                  className="p-3 rounded-xl bg-subtle border border-card-border"
                >
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-sm font-medium text-foreground">
                      {perk.perk_name}
                    </p>
                    {perk.perk_value && (
                      <span className={`text-xs font-semibold flex-shrink-0 ${colorClass}`}>
                        {perk.perk_value}
                      </span>
                    )}
                  </div>
                  {perk.perk_description && (
                    <p className="text-xs text-muted mt-1">
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

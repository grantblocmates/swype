import type { CardType } from "@/lib/types";

const typeConfig: Record<
  CardType,
  { label: string; color: string; bg: string }
> = {
  prepaid_debit: {
    label: "Prepaid Debit",
    color: "text-accent-ocean",
    bg: "bg-accent-ocean/10 border-accent-ocean/20",
  },
  pure_rewards: {
    label: "Rewards",
    color: "text-accent-yellow",
    bg: "bg-accent-yellow/10 border-accent-yellow/20",
  },
  collateralized_defi: {
    label: "DeFi",
    color: "text-accent-emerald",
    bg: "bg-accent-emerald/10 border-accent-emerald/20",
  },
  self_custody: {
    label: "Self-Custody",
    color: "text-accent-lavender",
    bg: "bg-accent-lavender/10 border-accent-lavender/20",
  },
};

// On-card variant (light text on dark card backgrounds)
const cardTypeConfig: Record<
  CardType,
  { label: string; color: string; bg: string }
> = {
  prepaid_debit: {
    label: "Prepaid Debit",
    color: "text-white",
    bg: "bg-white/20 border-white/20",
  },
  pure_rewards: {
    label: "Rewards",
    color: "text-white",
    bg: "bg-white/20 border-white/20",
  },
  collateralized_defi: {
    label: "DeFi",
    color: "text-white",
    bg: "bg-white/20 border-white/20",
  },
  self_custody: {
    label: "Self-Custody",
    color: "text-white",
    bg: "bg-white/20 border-white/20",
  },
};

export default function CardTypeBadge({
  type,
  size = "sm",
  variant = "default",
}: {
  type: CardType;
  size?: "sm" | "md";
  variant?: "default" | "on-card";
}) {
  const config = variant === "on-card" ? cardTypeConfig[type] : typeConfig[type];
  const sizeClasses =
    size === "sm" ? "text-[10px] px-2.5 py-0.5" : "text-xs px-3 py-1";

  return (
    <span
      className={`inline-flex items-center rounded-full border font-semibold ${config.color} ${config.bg} ${sizeClasses}`}
    >
      {config.label}
    </span>
  );
}

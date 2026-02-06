import type { CardType } from "@/lib/types";

const typeConfig: Record<
  CardType,
  { label: string; color: string; bg: string }
> = {
  prepaid_debit: {
    label: "Prepaid Debit",
    color: "text-blue-700",
    bg: "bg-blue-50 border-blue-200",
  },
  pure_rewards: {
    label: "Rewards",
    color: "text-amber-700",
    bg: "bg-amber-50 border-amber-200",
  },
  collateralized_defi: {
    label: "DeFi",
    color: "text-purple-700",
    bg: "bg-purple-50 border-purple-200",
  },
  self_custody: {
    label: "Self-Custody",
    color: "text-teal-700",
    bg: "bg-teal-50 border-teal-200",
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
    size === "sm" ? "text-[10px] px-2 py-0.5" : "text-xs px-2.5 py-1";

  return (
    <span
      className={`inline-flex items-center rounded-full border font-medium ${config.color} ${config.bg} ${sizeClasses}`}
    >
      {config.label}
    </span>
  );
}

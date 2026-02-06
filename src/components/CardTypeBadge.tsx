import type { CardType } from "@/lib/types";

const typeConfig: Record<
  CardType,
  { label: string; color: string; bg: string }
> = {
  prepaid_debit: {
    label: "Prepaid Debit",
    color: "text-blue-300",
    bg: "bg-blue-500/20 border-blue-500/30",
  },
  pure_rewards: {
    label: "Rewards",
    color: "text-amber-300",
    bg: "bg-amber-500/20 border-amber-500/30",
  },
  collateralized_defi: {
    label: "DeFi",
    color: "text-purple-300",
    bg: "bg-purple-500/20 border-purple-500/30",
  },
  self_custody: {
    label: "Self-Custody",
    color: "text-emerald-300",
    bg: "bg-emerald-500/20 border-emerald-500/30",
  },
};

export default function CardTypeBadge({
  type,
  size = "sm",
}: {
  type: CardType;
  size?: "sm" | "md";
}) {
  const config = typeConfig[type];
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

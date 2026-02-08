import type { CardType } from "@/lib/types";
import { CreditCard, Lightning, ShieldCheck } from "@phosphor-icons/react";

const typeConfig: Record<
  CardType,
  { label: string; color: string; bg: string; icon: React.ReactNode }
> = {
  prepaid_debit: {
    label: "Prepaid Debit",
    color: "text-dark",
    bg: "bg-accent-yellow/12 border-accent-yellow/20",
    icon: <CreditCard size={14} weight="bold" />,
  },
  pure_rewards: {
    label: "Rewards",
    color: "text-accent-yellow",
    bg: "bg-accent-yellow/12 border-accent-yellow/20",
    icon: <CreditCard size={14} weight="bold" />,
  },
  collateralized_defi: {
    label: "DeFi",
    color: "text-accent-emerald",
    bg: "bg-accent-emerald/12 border-accent-emerald/20",
    icon: <Lightning size={14} weight="bold" />,
  },
  self_custody: {
    label: "Self-Custody",
    color: "text-accent-ocean",
    bg: "bg-accent-ocean/12 border-accent-ocean/20",
    icon: <ShieldCheck size={14} weight="bold" />,
  },
};

// On-card variant (light text on dark card backgrounds)
const cardTypeConfig: Record<
  CardType,
  { label: string; color: string; bg: string; icon: React.ReactNode }
> = {
  prepaid_debit: {
    label: "Prepaid Debit",
    color: "text-white",
    bg: "bg-white/20 border-white/20",
    icon: <CreditCard size={14} weight="bold" />,
  },
  pure_rewards: {
    label: "Rewards",
    color: "text-white",
    bg: "bg-white/20 border-white/20",
    icon: <CreditCard size={14} weight="bold" />,
  },
  collateralized_defi: {
    label: "DeFi",
    color: "text-white",
    bg: "bg-white/20 border-white/20",
    icon: <Lightning size={14} weight="bold" />,
  },
  self_custody: {
    label: "Self-Custody",
    color: "text-white",
    bg: "bg-white/20 border-white/20",
    icon: <ShieldCheck size={14} weight="bold" />,
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
    size === "sm" ? "text-[10px] px-2.5 py-0.5 gap-1" : "text-xs px-3 py-1 gap-1.5";

  return (
    <span
      className={`inline-flex items-center rounded-full border font-semibold ${config.color} ${config.bg} ${sizeClasses}`}
    >
      {config.icon}
      {config.label}
    </span>
  );
}

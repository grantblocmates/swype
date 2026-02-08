import type { CardType, CardNetwork } from "@/lib/types";
import CardTypeBadge from "./CardTypeBadge";
import { CreditCard, Shield, Wallet } from "@phosphor-icons/react";

const gradientMap: Record<CardType, string> = {
  prepaid_debit: "from-blue-900 via-blue-800 to-slate-900",
  pure_rewards: "from-amber-900 via-orange-800 to-slate-900",
  collateralized_defi: "from-purple-900 via-violet-800 to-slate-900",
  self_custody: "from-emerald-900 via-teal-800 to-slate-900",
};

function NetworkLogo({ network }: { network: CardNetwork }) {
  return (
    <span className="text-[10px] font-bold uppercase tracking-wider text-white/60">
      {network === "both" ? "VISA / MC" : network.toUpperCase()}
    </span>
  );
}

function CustodyIcon({ model }: { model: string | null }) {
  if (model === "self_custody") return <Shield className="w-4 h-4" weight="duotone" />;
  if (model === "hybrid") return <Wallet className="w-4 h-4" weight="duotone" />;
  return <CreditCard className="w-4 h-4" weight="duotone" />;
}

interface CardVisualProps {
  name: string;
  issuer: string;
  card_type: CardType;
  card_network: CardNetwork;
  custody_model: string | null;
  card_color?: string | null;
  compact?: boolean;
}

export default function CardVisual({
  name,
  issuer,
  card_type,
  card_network,
  custody_model,
  card_color,
}: CardVisualProps) {
  const gradient = gradientMap[card_type];
  const customBg = card_color
    ? { background: card_color }
    : undefined;

  return (
    <div
      className={`relative overflow-hidden rounded-2xl w-full aspect-[1.586/1] border border-white/10 ${
        !customBg ? `bg-gradient-to-br ${gradient}` : ""
      }`}
      style={{
        ...customBg,
        boxShadow: "0 8px 30px rgba(0,0,0,0.08), inset 0 1px 0 rgba(255,255,255,0.1)",
      }}
    >
      {/* Subtle pattern overlay */}
      <div className="absolute inset-0 opacity-10">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 50%, rgba(255,255,255,0.15) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(255,255,255,0.1) 0%, transparent 50%)",
          }}
        />
      </div>

      {/* Card content */}
      <div className="relative flex flex-col justify-between h-full p-5">
        {/* Top row: issuer + type badge */}
        <div className="flex items-start justify-between">
          <div>
            <p className="text-white/50 text-xs font-medium uppercase tracking-wider">
              {issuer}
            </p>
            <h3 className="text-white text-lg font-bold mt-0.5 leading-tight">
              {name}
            </h3>
          </div>
          <CardTypeBadge type={card_type} variant="on-card" />
        </div>

        {/* Bottom row: custody icon + network */}
        <div className="flex items-end justify-between">
          <div className="flex items-center gap-1.5 text-white/50">
            <CustodyIcon model={custody_model} />
            <span className="text-[10px] uppercase tracking-wider">
              {custody_model?.replace("_", "-") || "custodial"}
            </span>
          </div>
          <NetworkLogo network={card_network} />
        </div>
      </div>
    </div>
  );
}

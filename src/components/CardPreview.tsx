import type { TierCardPreview } from "@/lib/types";
import CardVisual from "./CardVisual";
import ChainBadge from "./ChainBadge";
import {
  Percent,
  DollarSign,
  ArrowRightLeft,
} from "lucide-react";

interface CardPreviewProps {
  card: TierCardPreview;
}

export default function CardPreview({ card }: CardPreviewProps) {
  return (
    <div className="w-full max-w-sm mx-auto">
      {/* Card visual */}
      <CardVisual
        name={card.displayName}
        issuer={card.issuer}
        card_type={card.card_type}
        card_network={card.card_network}
        custody_model={card.custody_model}
        card_color={card.card_color}
      />

      {/* Key stats below the card */}
      <div className="mt-5 grid grid-cols-3 gap-2.5">
        <StatBox
          icon={<Percent className="w-3.5 h-3.5" />}
          label="Cashback"
          value={
            card.cashback_percent != null
              ? `${card.cashback_percent}%`
              : "\u2014"
          }
        />
        <StatBox
          icon={<DollarSign className="w-3.5 h-3.5" />}
          label="Monthly"
          value={
            card.monthly_fee === 0 || card.monthly_fee == null
              ? "Free"
              : `$${card.monthly_fee}/mo`
          }
        />
        <StatBox
          icon={<ArrowRightLeft className="w-3.5 h-3.5" />}
          label="FX Fee"
          value={
            card.fx_markup_percent != null
              ? `${card.fx_markup_percent}%`
              : "\u2014"
          }
        />
      </div>

      {/* Chain badges */}
      {card.supported_chains.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-1.5">
          {card.supported_chains.map((chain) => (
            <ChainBadge key={chain} chain={chain} />
          ))}
        </div>
      )}

      {/* Description */}
      {card.description && (
        <p className="mt-4 text-sm text-muted leading-relaxed line-clamp-2">
          {card.description}
        </p>
      )}
    </div>
  );
}

function StatBox({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="bg-card-bg rounded-xl px-3 py-3 border border-card-border shadow-card">
      <div className="flex items-center gap-1.5 text-muted mb-1.5">
        {icon}
        <span className="text-xs uppercase tracking-wider font-semibold">{label}</span>
      </div>
      <p className="text-base font-bold text-foreground">{value}</p>
    </div>
  );
}

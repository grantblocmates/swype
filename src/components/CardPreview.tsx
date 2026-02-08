import type { TierCardPreview } from "@/lib/types";
import CardVisual from "./CardVisual";
import ChainBadge from "./ChainBadge";
import CardTypeBadge from "./CardTypeBadge";
import {
  Percent,
  CurrencyDollar,
  ArrowsLeftRight,
} from "@phosphor-icons/react";

interface CardPreviewProps {
  card: TierCardPreview;
}

export default function CardPreview({ card }: CardPreviewProps) {
  return (
    <div className="w-full max-w-sm mx-auto">
      {/* Card type badge */}
      <div className="flex justify-end mb-2">
        <CardTypeBadge type={card.card_type} />
      </div>

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
          icon={<Percent className="w-3.5 h-3.5" weight="bold" />}
          label="Cashback"
          value={
            card.cashback_percent != null
              ? `${card.cashback_percent}%`
              : "\u2014"
          }
          colorClass="bg-accent-emerald/10 text-accent-emerald"
        />
        <StatBox
          icon={<CurrencyDollar className="w-3.5 h-3.5" weight="bold" />}
          label="Monthly"
          value={
            card.monthly_fee === 0 || card.monthly_fee == null
              ? "Free"
              : `$${card.monthly_fee}/mo`
          }
          colorClass="bg-accent-sky/10 text-accent-ocean"
        />
        <StatBox
          icon={<ArrowsLeftRight className="w-3.5 h-3.5" weight="bold" />}
          label="FX Fee"
          value={
            card.fx_markup_percent != null
              ? `${card.fx_markup_percent}%`
              : "\u2014"
          }
          colorClass="bg-accent-grape/10 text-accent-lavender"
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
  colorClass,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  colorClass: string;
}) {
  return (
    <div className={`rounded-2xl px-3 py-3 ${colorClass}`}>
      <div className="flex items-center gap-1.5 mb-1.5 opacity-70">
        {icon}
        <span className="text-xs uppercase tracking-wider font-semibold">{label}</span>
      </div>
      <p className="text-base font-bold">{value}</p>
    </div>
  );
}

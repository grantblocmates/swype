import type { CardPreviewData } from "@/lib/types";
import CardVisual from "./CardVisual";
import ChainBadge from "./ChainBadge";
import {
  Percent,
  DollarSign,
  ArrowRightLeft,
} from "lucide-react";

interface CardPreviewProps {
  card: CardPreviewData;
}

export default function CardPreview({ card }: CardPreviewProps) {
  return (
    <div className="w-full max-w-sm mx-auto">
      {/* Card visual */}
      <CardVisual
        name={card.name}
        issuer={card.issuer}
        card_type={card.card_type}
        card_network={card.card_network}
        custody_model={card.custody_model}
      />

      {/* Key stats below the card */}
      <div className="mt-4 grid grid-cols-3 gap-3">
        <StatBox
          icon={<Percent className="w-3.5 h-3.5" />}
          label="Cashback"
          value={
            card.cashback_percent != null
              ? `${card.cashback_percent}%`
              : "—"
          }
        />
        <StatBox
          icon={<DollarSign className="w-3.5 h-3.5" />}
          label="Monthly Fee"
          value={
            card.monthly_fee === 0
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
              : "—"
          }
        />
      </div>

      {/* Chain badges */}
      {card.supported_chains.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {card.supported_chains.map((chain) => (
            <ChainBadge key={chain} chain={chain} />
          ))}
        </div>
      )}

      {/* Description */}
      {card.description && (
        <p className="mt-3 text-sm text-zinc-400 leading-relaxed line-clamp-2">
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
    <div className="bg-white/5 rounded-lg px-3 py-2 border border-white/5">
      <div className="flex items-center gap-1.5 text-zinc-500 mb-1">
        {icon}
        <span className="text-[10px] uppercase tracking-wider">{label}</span>
      </div>
      <p className="text-sm font-semibold text-white">{value}</p>
    </div>
  );
}

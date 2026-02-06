import type { SupportedAsset } from "@/lib/types";
import { Coins } from "lucide-react";

interface AssetGridProps {
  assets: SupportedAsset[];
}

export default function AssetGrid({ assets }: AssetGridProps) {
  if (assets.length === 0) {
    return (
      <p className="text-sm text-zinc-500 italic">
        No asset information available.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
      {assets.map((asset) => (
        <div
          key={asset.id}
          className="flex items-center gap-2.5 p-2.5 rounded-lg bg-white/5 border border-white/5"
        >
          <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0">
            <Coins className="w-4 h-4 text-zinc-400" />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-semibold text-white truncate">
              {asset.asset_ticker}
            </p>
            <div className="flex gap-1 mt-0.5">
              {asset.can_spend && (
                <span className="text-[8px] px-1 py-0.5 rounded bg-success/20 text-success font-medium">
                  SPEND
                </span>
              )}
              {asset.can_hold && (
                <span className="text-[8px] px-1 py-0.5 rounded bg-blue-500/20 text-blue-300 font-medium">
                  HOLD
                </span>
              )}
              {asset.can_collateralize && (
                <span className="text-[8px] px-1 py-0.5 rounded bg-purple-500/20 text-purple-300 font-medium">
                  COLLAT
                </span>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

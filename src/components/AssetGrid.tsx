import type { SupportedAsset } from "@/lib/types";
import { Coins } from "lucide-react";

interface AssetGridProps {
  assets: SupportedAsset[];
}

export default function AssetGrid({ assets }: AssetGridProps) {
  if (assets.length === 0) {
    return (
      <p className="text-sm text-muted italic">
        No asset information available.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
      {assets.map((asset) => (
        <div
          key={asset.id}
          className="flex items-center gap-2.5 p-2.5 rounded-xl bg-subtle border border-card-border"
        >
          <div className="w-8 h-8 rounded-full bg-card-border/50 flex items-center justify-center flex-shrink-0">
            <Coins className="w-4 h-4 text-muted" />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-semibold text-foreground truncate">
              {asset.asset_ticker}
            </p>
            <div className="flex gap-1 mt-0.5">
              {asset.can_spend && (
                <span className="text-[8px] px-1 py-0.5 rounded bg-accent/10 text-accent font-medium">
                  SPEND
                </span>
              )}
              {asset.can_hold && (
                <span className="text-[8px] px-1 py-0.5 rounded bg-blue-50 text-blue-600 font-medium">
                  HOLD
                </span>
              )}
              {asset.can_collateralize && (
                <span className="text-[8px] px-1 py-0.5 rounded bg-purple-50 text-purple-600 font-medium">
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

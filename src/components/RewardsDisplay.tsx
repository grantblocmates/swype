import type { Reward, CategoryBonus } from "@/lib/types";
import { Gift, AlertTriangle, Sparkles } from "lucide-react";

interface RewardsDisplayProps {
  rewards: Reward | null;
}

export default function RewardsDisplay({ rewards }: RewardsDisplayProps) {
  if (!rewards) {
    return (
      <p className="text-sm text-zinc-500 italic">
        No rewards information available.
      </p>
    );
  }

  return (
    <div className="space-y-4">
      {/* Cashback */}
      {rewards.cashback_percent != null && (
        <div className="flex items-start gap-3 p-3 rounded-xl bg-success/5 border border-success/10">
          <Gift className="w-5 h-5 text-success mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-sm font-semibold text-white">
              {rewards.cashback_percent}% Cashback
            </p>
            <p className="text-xs text-zinc-400 mt-0.5">
              Paid in{" "}
              {rewards.cashback_is_token
                ? rewards.cashback_currency || "native token"
                : rewards.cashback_currency || "USD"}
              {rewards.cashback_max_monthly != null &&
                ` · Max $${rewards.cashback_max_monthly}/mo`}
            </p>
          </div>
        </div>
      )}

      {/* Points Program */}
      {rewards.has_points_program && (
        <div className="flex items-start gap-3 p-3 rounded-xl bg-accent/5 border border-accent/10">
          <Sparkles className="w-5 h-5 text-accent mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-sm font-semibold text-white">
              {rewards.points_name || "Points Program"}
            </p>
            {rewards.points_per_spend != null && (
              <p className="text-xs text-zinc-400 mt-0.5">
                {rewards.points_per_spend} point
                {rewards.points_per_spend !== 1 ? "s" : ""} per{" "}
                {rewards.points_currency || "$"}
                {rewards.points_spend_unit || "1"} spent
              </p>
            )}
          </div>
        </div>
      )}

      {/* Category Bonuses */}
      {rewards.category_bonuses &&
        (rewards.category_bonuses as CategoryBonus[]).length > 0 && (
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-500 mb-2">
              Category Bonuses
            </h4>
            <div className="grid grid-cols-2 gap-2">
              {(rewards.category_bonuses as CategoryBonus[]).map(
                (bonus, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between p-2 rounded-lg bg-white/5"
                  >
                    <span className="text-xs text-zinc-300 capitalize">
                      {bonus.category}
                    </span>
                    <span className="text-xs font-semibold text-success">
                      {bonus.percent}%
                    </span>
                  </div>
                )
              )}
            </div>
          </div>
        )}

      {/* Sustainability Warning */}
      {(rewards.is_promotional || rewards.is_subsidized) && (
        <div className="flex items-start gap-3 p-3 rounded-xl bg-amber-500/5 border border-amber-500/10">
          <AlertTriangle className="w-5 h-5 text-amber-400 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-sm font-semibold text-amber-300">
              {rewards.is_promotional ? "Promotional Rate" : "Subsidized Rewards"}
            </p>
            <p className="text-xs text-zinc-400 mt-0.5">
              {rewards.is_promotional && rewards.promo_end_date
                ? `Ends ${new Date(rewards.promo_end_date).toLocaleDateString()}`
                : rewards.rewards_source ||
                  "These rewards may not be sustainable long-term."}
            </p>
          </div>
        </div>
      )}

      {/* Source */}
      {rewards.rewards_source && !rewards.is_subsidized && (
        <p className="text-xs text-zinc-500">
          <span className="font-medium">Source:</span> {rewards.rewards_source}
        </p>
      )}

      {rewards.reward_notes && (
        <p className="text-xs text-zinc-500 italic">{rewards.reward_notes}</p>
      )}
    </div>
  );
}

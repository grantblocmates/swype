import type { Reward, CategoryBonus } from "@/lib/types";
import { Gift, AlertTriangle, Sparkles } from "lucide-react";

interface RewardsDisplayProps {
  rewards: Reward | null;
}

export default function RewardsDisplay({ rewards }: RewardsDisplayProps) {
  if (!rewards) {
    return (
      <p className="text-sm text-muted italic">
        No rewards information available.
      </p>
    );
  }

  return (
    <div className="space-y-4">
      {/* Cashback */}
      {rewards.cashback_percent != null && (
        <div className="flex items-start gap-3 p-3 rounded-xl bg-accent/5 border border-accent/10">
          <Gift className="w-5 h-5 text-accent mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-sm font-semibold text-foreground">
              {rewards.cashback_percent}% Cashback
            </p>
            <p className="text-xs text-muted mt-0.5">
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
        <div className="flex items-start gap-3 p-3 rounded-xl bg-purple-50 border border-purple-100">
          <Sparkles className="w-5 h-5 text-purple-600 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-sm font-semibold text-foreground">
              {rewards.points_name || "Points Program"}
            </p>
            {rewards.points_per_spend != null && (
              <p className="text-xs text-muted mt-0.5">
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
            <h4 className="text-xs font-semibold uppercase tracking-wider text-muted mb-2">
              Category Bonuses
            </h4>
            <div className="grid grid-cols-2 gap-2">
              {(rewards.category_bonuses as CategoryBonus[]).map(
                (bonus, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between p-2 rounded-xl bg-subtle border border-card-border"
                  >
                    <span className="text-xs text-foreground/80 capitalize">
                      {bonus.category}
                    </span>
                    <span className="text-xs font-semibold text-accent">
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
        <div className="flex items-start gap-3 p-3 rounded-xl bg-secondary/5 border border-secondary/10">
          <AlertTriangle className="w-5 h-5 text-secondary mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-sm font-semibold text-secondary">
              {rewards.is_promotional ? "Promotional Rate" : "Subsidized Rewards"}
            </p>
            <p className="text-xs text-muted mt-0.5">
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
        <p className="text-xs text-muted">
          <span className="font-medium">Source:</span> {rewards.rewards_source}
        </p>
      )}

      {rewards.reward_notes && (
        <p className="text-xs text-muted italic">{rewards.reward_notes}</p>
      )}
    </div>
  );
}

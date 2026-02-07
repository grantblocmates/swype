import type { TierCardPreview, QuizAnswers, QuizRegion } from "./types";

// Region matching: map quiz regions to country code patterns
const REGION_PATTERNS: Record<QuizRegion, string[]> = {
  US: ["US", "United States", "USA"],
  EU: [
    "EU", "EEA", "Europe",
    "Austria", "Belgium", "Bulgaria", "Croatia", "Cyprus", "Czech Republic",
    "Denmark", "Estonia", "Finland", "France", "Germany", "Greece", "Hungary",
    "Ireland", "Italy", "Latvia", "Lithuania", "Luxembourg", "Malta",
    "Netherlands", "Poland", "Portugal", "Romania", "Slovakia", "Slovenia",
    "Spain", "Sweden", "Norway", "Iceland", "Liechtenstein",
  ],
  UK: ["UK", "United Kingdom", "GB", "Great Britain"],
  OTHER: [], // matches everything
};

function matchesRegion(card: TierCardPreview, region: QuizRegion | null): boolean {
  if (!region || region === "OTHER") return true;
  if (!card.supported_countries || card.supported_countries.length === 0) return true;

  const patterns = REGION_PATTERNS[region].map((p) => p.toLowerCase());
  const countries = card.supported_countries.map((c) => c.toLowerCase());

  // Check if card supports "Global" or any country matching the region
  if (countries.some((c) => c === "global" || c === "worldwide")) return true;

  return countries.some((c) => patterns.some((p) => c.includes(p) || p.includes(c)));
}

export interface ScoredCard {
  card: TierCardPreview;
  score: number;
  matchReason: string;
}

export function scoreAndFilterCards(
  cards: TierCardPreview[],
  answers: QuizAnswers
): ScoredCard[] {
  const scored: ScoredCard[] = [];

  for (const card of cards) {
    // Region is a hard filter
    if (!matchesRegion(card, answers.region)) continue;

    let score = 0;
    const reasons: string[] = [];

    // Priority scoring
    if (answers.priorities.includes("cashback")) {
      if (card.cashback_percent != null && card.cashback_percent > 0) {
        score += card.cashback_percent * 15;
        if (card.cashback_percent >= 2) {
          reasons.push(`${card.cashback_percent}% cashback`);
        }
      }
    }

    if (answers.priorities.includes("self_custody")) {
      if (card.custody_model === "self_custody") {
        score += 40;
        reasons.push("Self-custody");
      }
    }

    if (answers.priorities.includes("no_fees")) {
      if (card.monthly_fee === 0 || card.monthly_fee == null) {
        score += 20;
        reasons.push("No monthly fee");
      }
      if (!card.staking_required) score += 15;
      if (card.fx_markup_percent === 0) {
        score += 10;
        reasons.push("0% FX fee");
      }
    }

    if (answers.priorities.includes("borrow")) {
      if (card.card_type === "collateralized_defi") {
        score += 40;
        reasons.push("Borrow against crypto");
      }
    }

    // Staking preference
    if (answers.staking === "no" || answers.staking === "unsure") {
      if (card.staking_required) {
        score -= 25;
      } else {
        score += 10;
      }
    }
    if (answers.staking === "yes") {
      if (card.staking_required && card.cashback_percent != null) {
        score += 10;
      }
    }

    // Usage scoring
    if (answers.usage.includes("everyday")) {
      if (card.cashback_percent != null && card.cashback_percent > 0) {
        score += card.cashback_percent * 5;
      }
      if (card.apple_pay || card.google_pay) score += 5;
    }

    if (answers.usage.includes("travel")) {
      if (card.fx_markup_percent != null) {
        if (card.fx_markup_percent === 0) {
          score += 20;
          if (!reasons.includes("0% FX fee")) reasons.push("Great for travel");
        } else if (card.fx_markup_percent < 1) {
          score += 10;
        }
      }
    }

    if (answers.usage.includes("atm")) {
      // ATM data not in preview, but we can boost low-fee cards
      score += 5;
    }

    if (answers.usage.includes("trying")) {
      if ((card.monthly_fee === 0 || card.monthly_fee == null) && !card.staking_required) {
        score += 20;
        if (reasons.length === 0) reasons.push("Free and easy to start");
      }
    }

    // Build match reason
    let matchReason = reasons.length > 0
      ? reasons.slice(0, 2).join(" · ")
      : "Good all-around option";

    // Add region context
    if (answers.region && answers.region !== "OTHER") {
      const regionLabel = { US: "the US", EU: "Europe", UK: "the UK" }[answers.region];
      if (regionLabel && !matchReason.includes("region")) {
        matchReason += ` · Available in ${regionLabel}`;
      }
    }

    scored.push({ card, score, matchReason });
  }

  // Sort by score descending
  scored.sort((a, b) => b.score - a.score);

  return scored;
}

/** Serialize quiz answers to URL search params */
export function answersToParams(answers: QuizAnswers): string {
  const params = new URLSearchParams();
  if (answers.region) params.set("region", answers.region);
  if (answers.priorities.length > 0) params.set("priorities", answers.priorities.join(","));
  if (answers.staking) params.set("staking", answers.staking);
  if (answers.usage.length > 0) params.set("usage", answers.usage.join(","));
  return params.toString();
}

/** Parse quiz answers from URL search params */
export function paramsToAnswers(searchParams: URLSearchParams): QuizAnswers {
  return {
    region: (searchParams.get("region") as QuizAnswers["region"]) || null,
    priorities: (searchParams.get("priorities")?.split(",").filter(Boolean) || []) as QuizAnswers["priorities"],
    staking: (searchParams.get("staking") as QuizAnswers["staking"]) || null,
    usage: (searchParams.get("usage")?.split(",").filter(Boolean) || []) as QuizAnswers["usage"],
  };
}

// ============================================================
// Swype - TypeScript Interfaces
// Matches Supabase PostgreSQL schema defined in database.sql
// ============================================================

// ---- Enums ----

export type CardType =
  | 'prepaid_debit'
  | 'pure_rewards'
  | 'collateralized_defi'
  | 'self_custody';

export type CardNetwork = 'visa' | 'mastercard' | 'both';

export type CustodyModel = 'self_custody' | 'custodial' | 'hybrid';

export type PerkCategory =
  | 'insurance'
  | 'lounge_access'
  | 'subscriptions'
  | 'yield'
  | 'defi_feature'
  | 'transfers'
  | 'privacy'
  | 'concierge'
  | 'other';

// ---- JSONB helper types ----

export interface CategoryBonus {
  category: string;
  percent: number;
}

// ---- Database row interfaces ----

/** Row from the `cards` table - top-level card products */
export interface Card {
  id: string;
  name: string;
  slug: string;
  issuer: string;
  card_type: CardType;
  card_network: CardNetwork;
  supported_chains: string[];
  custody_model: CustodyModel;
  has_native_token: boolean;
  token_ticker: string | null;
  token_coingecko_id: string | null;
  kyc_required: boolean;
  supported_countries: string[];
  apple_pay: boolean;
  google_pay: boolean;
  ref_link: string | null;
  ref_link_slug: string | null;
  card_image_url: string | null;
  logo_url: string | null;
  description: string | null;
  long_description: string | null;
  blocmates_article_url: string | null;
  website_url: string | null;
  year_launched: number | null;
  is_active: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
}

/** Row from the `tiers` table - card tiers / plans */
export interface Tier {
  id: string;
  card_id: string;
  name: string;
  slug: string;
  monthly_fee: number | null;
  annual_fee: number | null;
  fee_currency: string;
  staking_required: boolean;
  staking_amount: number | null;
  staking_token: string | null;
  tier_order: number;
  is_default: boolean;
  card_color: string | null;
  daily_spend_limit: number | null;
  monthly_spend_limit: number | null;
  created_at: string;
  updated_at: string;
}

/** Row from the `fees` table - fee structure per tier */
export interface Fee {
  id: string;
  tier_id: string;
  fx_markup_percent: number | null;
  fx_free_limit_monthly: number | null;
  weekend_fx_surcharge: number | null;
  atm_fee_domestic: number | null;
  atm_fee_international: number | null;
  atm_fee_percent: number | null;
  atm_free_limit_monthly: number | null;
  topup_fee_crypto: number | null;
  topup_fee_bank: number | null;
  topup_fee_card: number | null;
  borrow_interest_rate: number | null;
  liquidation_threshold: number | null;
  min_collateral_ratio: number | null;
  inactivity_fee: number | null;
  card_replacement_fee: number | null;
  fee_notes: string | null;
  created_at: string;
  updated_at: string;
}

/** Row from the `rewards` table - reward structure per tier */
export interface Reward {
  id: string;
  tier_id: string;
  cashback_percent: number | null;
  cashback_max_monthly: number | null;
  cashback_currency: string | null;
  cashback_is_token: boolean;
  has_points_program: boolean;
  points_per_spend: number | null;
  points_spend_unit: number | null;
  points_currency: string | null;
  points_name: string | null;
  category_bonuses: CategoryBonus[];
  is_promotional: boolean;
  promo_end_date: string | null;
  is_subsidized: boolean;
  rewards_source: string | null;
  reward_notes: string | null;
  created_at: string;
  updated_at: string;
}

/** Row from the `perks` table - benefits per tier */
export interface Perk {
  id: string;
  tier_id: string;
  perk_category: PerkCategory;
  perk_name: string;
  perk_description: string | null;
  perk_value: string | null;
  display_order: number;
  created_at: string;
  updated_at: string;
}

/** Row from the `supported_assets` table - crypto assets per card */
export interface SupportedAsset {
  id: string;
  card_id: string;
  asset_name: string;
  asset_ticker: string;
  can_spend: boolean;
  can_hold: boolean;
  can_collateralize: boolean;
  created_at: string;
}

/** Row from the `user_saves` table - saved cards (anonymous session-based) */
export interface UserSave {
  id: string;
  session_id: string;
  card_id: string;
  tier_id: string | null;
  saved_at: string;
}

/** Row from the `ref_clicks` table - referral link click analytics */
export interface RefClick {
  id: string;
  card_id: string | null;
  clicked_at: string;
  source: string | null;
  user_agent: string | null;
  ip_hash: string | null;
}

// ---- Composite types for the UI ----

/** A tier joined with its fees, rewards, and perks */
export interface TierWithDetails extends Tier {
  fees: Fee | null;
  rewards: Reward | null;
  perks: Perk[];
}

/** A card joined with all of its tiers (with details) and supported assets */
export interface CardWithDetails extends Card {
  tiers: TierWithDetails[];
  supported_assets: SupportedAsset[];
}

/** Lightweight card preview data for carousels and listing pages */
export interface CardPreviewData {
  id: string;
  name: string;
  slug: string;
  issuer: string;
  card_type: CardType;
  card_network: CardNetwork;
  custody_model: CustodyModel | null;
  supported_chains: string[];
  card_image_url: string | null;
  logo_url: string | null;
  description: string | null;
  ref_link: string | null;
  has_native_token: boolean;
  token_ticker: string | null;
  display_order: number;
  // Key stats from the default tier
  default_tier_name: string | null;
  monthly_fee: number;
  cashback_percent: number | null;
  fx_markup_percent: number | null;
}

// ---- Tier-split types (each tier is a standalone card entry) ----

/** A single tier flattened into a standalone card entry for browse/compare/quiz */
export interface TierCard {
  // Composite identifiers
  tierId: string;
  cardId: string;
  slug: string; // combined: "etherfi-standard" or "revolut" for single-tier
  displayName: string; // "EtherFi Standard" or "Revolut" for single-tier

  // Card-level fields
  issuer: string;
  card_type: CardType;
  card_network: CardNetwork;
  custody_model: CustodyModel;
  supported_chains: string[];
  supported_countries: string[];
  kyc_required: boolean;
  apple_pay: boolean;
  google_pay: boolean;
  has_native_token: boolean;
  token_ticker: string | null;
  description: string | null;
  long_description: string | null;
  card_image_url: string | null;
  logo_url: string | null;
  ref_link: string | null;
  ref_link_slug: string | null;
  website_url: string | null;
  blocmates_article_url: string | null;
  year_launched: number | null;

  // Tier-level fields
  tierName: string;
  monthly_fee: number | null;
  annual_fee: number | null;
  staking_required: boolean;
  staking_amount: number | null;
  staking_token: string | null;
  card_color: string | null;

  // Detail data
  fees: Fee | null;
  rewards: Reward | null;
  perks: Perk[];
  supported_assets: SupportedAsset[];

  // Sort order
  display_order: number;
  tier_order: number;
}

/** Lightweight tier-card preview for carousels and quiz results */
export interface TierCardPreview {
  tierId: string;
  cardId: string;
  slug: string;
  displayName: string;
  issuer: string;
  description: string | null;
  card_type: CardType;
  card_network: CardNetwork;
  custody_model: CustodyModel;
  supported_chains: string[];
  supported_countries: string[];
  apple_pay: boolean;
  google_pay: boolean;
  kyc_required: boolean;
  card_image_url: string | null;
  logo_url: string | null;
  card_color: string | null;
  ref_link: string | null;
  tierName: string;
  monthly_fee: number | null;
  cashback_percent: number | null;
  fx_markup_percent: number | null;
  staking_required: boolean;
  staking_amount: number | null;
  staking_token: string | null;
  display_order: number;
  tier_order: number;
}

// ---- Quiz types ----

export type QuizRegion = 'US' | 'EU' | 'UK' | 'OTHER';
export type QuizPriority = 'cashback' | 'self_custody' | 'no_fees' | 'borrow';
export type QuizStaking = 'yes' | 'no' | 'unsure';
export type QuizUsage = 'everyday' | 'travel' | 'atm' | 'trying';

export interface QuizAnswers {
  region: QuizRegion | null;
  priorities: QuizPriority[];
  staking: QuizStaking | null;
  usage: QuizUsage[];
}

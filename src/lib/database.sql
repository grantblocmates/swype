-- ============================================================
-- CardStack - Crypto Card Comparison Site
-- Complete Database Schema
-- ============================================================

-- Enable pgcrypto for gen_random_uuid() if not already available
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================
-- 1. cards - Top-level card products
-- ============================================================
CREATE TABLE cards (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name                TEXT NOT NULL,
    slug                TEXT NOT NULL UNIQUE,
    issuer              TEXT NOT NULL,
    card_type           TEXT NOT NULL CHECK (card_type IN ('prepaid_debit', 'pure_rewards', 'collateralized_defi', 'self_custody')),
    card_network        TEXT NOT NULL CHECK (card_network IN ('visa', 'mastercard', 'both')),
    supported_chains    TEXT[] DEFAULT '{}',
    custody_model       TEXT NOT NULL CHECK (custody_model IN ('self_custody', 'custodial', 'hybrid')),
    has_native_token    BOOLEAN NOT NULL DEFAULT FALSE,
    token_ticker        TEXT,
    token_coingecko_id  TEXT,
    kyc_required        BOOLEAN NOT NULL DEFAULT TRUE,
    supported_countries TEXT[] DEFAULT '{}',
    apple_pay           BOOLEAN NOT NULL DEFAULT FALSE,
    google_pay          BOOLEAN NOT NULL DEFAULT FALSE,
    ref_link            TEXT,
    ref_link_slug       TEXT,
    card_image_url      TEXT,
    logo_url            TEXT,
    description         TEXT,
    long_description    TEXT,
    blocmates_article_url TEXT,
    website_url         TEXT,
    year_launched       INTEGER,
    is_active           BOOLEAN NOT NULL DEFAULT TRUE,
    display_order       INTEGER NOT NULL DEFAULT 0,
    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- 2. tiers - Card tiers / plans
-- ============================================================
CREATE TABLE tiers (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    card_id             UUID NOT NULL REFERENCES cards(id) ON DELETE CASCADE,
    name                TEXT NOT NULL,
    slug                TEXT NOT NULL,
    monthly_fee         DECIMAL(10, 2),
    annual_fee          DECIMAL(10, 2),
    fee_currency        TEXT NOT NULL DEFAULT 'USD',
    staking_required    BOOLEAN NOT NULL DEFAULT FALSE,
    staking_amount      DECIMAL(18, 2),
    staking_token       TEXT,
    tier_order          INTEGER NOT NULL DEFAULT 0,
    is_default          BOOLEAN NOT NULL DEFAULT FALSE,
    card_color          TEXT,
    daily_spend_limit   DECIMAL(12, 2),
    monthly_spend_limit DECIMAL(12, 2),
    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    UNIQUE (card_id, slug)
);

-- ============================================================
-- 3. fees - Fee structure per tier
-- ============================================================
CREATE TABLE fees (
    id                      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tier_id                 UUID NOT NULL REFERENCES tiers(id) ON DELETE CASCADE,
    fx_markup_percent       DECIMAL(5, 2),
    fx_free_limit_monthly   DECIMAL(12, 2),
    weekend_fx_surcharge    DECIMAL(5, 2),
    atm_fee_domestic        DECIMAL(8, 2),
    atm_fee_international   DECIMAL(8, 2),
    atm_fee_percent         DECIMAL(5, 2),
    atm_free_limit_monthly  DECIMAL(12, 2),
    topup_fee_crypto        DECIMAL(5, 2),
    topup_fee_bank          DECIMAL(5, 2),
    topup_fee_card          DECIMAL(5, 2),
    borrow_interest_rate    DECIMAL(5, 2),
    liquidation_threshold   DECIMAL(5, 2),
    min_collateral_ratio    DECIMAL(5, 2),
    inactivity_fee          DECIMAL(8, 2),
    card_replacement_fee    DECIMAL(8, 2),
    fee_notes               TEXT,
    created_at              TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at              TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- 4. rewards - Reward structure per tier
-- ============================================================
CREATE TABLE rewards (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tier_id             UUID NOT NULL REFERENCES tiers(id) ON DELETE CASCADE,
    cashback_percent    DECIMAL(5, 2),
    cashback_max_monthly DECIMAL(12, 2),
    cashback_currency   TEXT,
    cashback_is_token   BOOLEAN NOT NULL DEFAULT FALSE,
    has_points_program  BOOLEAN NOT NULL DEFAULT FALSE,
    points_per_spend    DECIMAL(8, 2),
    points_spend_unit   TEXT,
    points_currency     TEXT,
    points_name         TEXT,
    category_bonuses    JSONB NOT NULL DEFAULT '[]',
    is_promotional      BOOLEAN NOT NULL DEFAULT FALSE,
    promo_end_date      TIMESTAMPTZ,
    is_subsidized       BOOLEAN NOT NULL DEFAULT FALSE,
    rewards_source      TEXT,
    reward_notes        TEXT,
    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- 5. perks - Benefits per tier
-- ============================================================
CREATE TABLE perks (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tier_id             UUID NOT NULL REFERENCES tiers(id) ON DELETE CASCADE,
    perk_category       TEXT NOT NULL CHECK (perk_category IN ('insurance', 'lounge_access', 'subscriptions', 'yield', 'defi_feature', 'transfers', 'privacy', 'concierge', 'other')),
    perk_name           TEXT NOT NULL,
    perk_description    TEXT,
    perk_value          DECIMAL(10, 2),
    display_order       INTEGER NOT NULL DEFAULT 0,
    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- 6. supported_assets - Crypto assets per card
-- ============================================================
CREATE TABLE supported_assets (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    card_id             UUID NOT NULL REFERENCES cards(id) ON DELETE CASCADE,
    asset_name          TEXT NOT NULL,
    asset_ticker        TEXT NOT NULL,
    can_spend           BOOLEAN NOT NULL DEFAULT FALSE,
    can_hold            BOOLEAN NOT NULL DEFAULT FALSE,
    can_collateralize   BOOLEAN NOT NULL DEFAULT FALSE,
    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- 7. user_saves - Saved cards (anonymous session-based)
-- ============================================================
CREATE TABLE user_saves (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id          TEXT NOT NULL,
    card_id             UUID NOT NULL REFERENCES cards(id) ON DELETE CASCADE,
    tier_id             UUID REFERENCES tiers(id),
    saved_at            TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    UNIQUE (session_id, card_id)
);

-- ============================================================
-- 8. ref_clicks - Referral link click analytics
-- ============================================================
CREATE TABLE ref_clicks (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    card_id             UUID REFERENCES cards(id),
    clicked_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    source              TEXT,
    user_agent          TEXT,
    ip_hash             TEXT
);

-- ============================================================
-- Indexes for common query patterns
-- ============================================================

-- cards
CREATE INDEX idx_cards_card_type ON cards(card_type);
CREATE INDEX idx_cards_card_network ON cards(card_network);
CREATE INDEX idx_cards_custody_model ON cards(custody_model);
CREATE INDEX idx_cards_is_active ON cards(is_active);
CREATE INDEX idx_cards_display_order ON cards(display_order);

-- tiers
CREATE INDEX idx_tiers_card_id ON tiers(card_id);
CREATE INDEX idx_tiers_tier_order ON tiers(tier_order);

-- fees
CREATE INDEX idx_fees_tier_id ON fees(tier_id);

-- rewards
CREATE INDEX idx_rewards_tier_id ON rewards(tier_id);

-- perks
CREATE INDEX idx_perks_tier_id ON perks(tier_id);
CREATE INDEX idx_perks_perk_category ON perks(perk_category);

-- supported_assets
CREATE INDEX idx_supported_assets_card_id ON supported_assets(card_id);
CREATE INDEX idx_supported_assets_asset_ticker ON supported_assets(asset_ticker);

-- user_saves
CREATE INDEX idx_user_saves_session_id ON user_saves(session_id);
CREATE INDEX idx_user_saves_card_id ON user_saves(card_id);

-- ref_clicks
CREATE INDEX idx_ref_clicks_card_id ON ref_clicks(card_id);
CREATE INDEX idx_ref_clicks_clicked_at ON ref_clicks(clicked_at);

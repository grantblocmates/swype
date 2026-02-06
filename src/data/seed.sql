-- ============================================================
-- CardStack - Seed Data
-- 5 Crypto Cards with Tiers, Fees, Rewards, Perks, Assets
-- ============================================================

-- Clean existing data (in reverse dependency order)
DELETE FROM supported_assets;
DELETE FROM perks;
DELETE FROM rewards;
DELETE FROM fees;
DELETE FROM tiers;
DELETE FROM ref_clicks;
DELETE FROM user_saves;
DELETE FROM cards;

-- ============================================================
-- CARDS
-- ============================================================

INSERT INTO cards (
    id, name, slug, issuer, card_type, card_network,
    supported_chains, custody_model, has_native_token, token_ticker, token_coingecko_id,
    kyc_required, supported_countries, apple_pay, google_pay,
    ref_link, ref_link_slug, card_image_url, logo_url,
    description, long_description, blocmates_article_url, website_url,
    year_launched, is_active, display_order
) VALUES

-- 1. EtherFi Cash
(
    '11111111-1111-1111-1111-111111111111',
    'EtherFi Cash',
    'etherfi-cash',
    'EtherFi',
    'collateralized_defi',
    'visa',
    ARRAY['ethereum', 'scroll'],
    'hybrid',
    TRUE,
    'ETHFI',
    'ether-fi',
    TRUE,
    ARRAY['US', 'GB', 'DE', 'FR', 'NL', 'SG', 'AU', 'CA', 'CH', 'AT'],
    TRUE,
    TRUE,
    'https://blocmates.com/go/etherfi',
    'etherfi',
    '/images/cards/etherfi.png',
    '/images/logos/etherfi.svg',
    'Borrow against your staked ETH to spend with a Visa card. Your crypto keeps earning yield while you spend.',
    'EtherFi Cash lets you borrow against your liquid staking positions (weETH, eETH) to fund a Visa card. Your collateral continues earning staking rewards and EigenLayer restaking yield, so you never have to sell. Powered by DeFi lending markets on Scroll L2 for low gas fees. Repay your balance anytime with no fixed schedule.',
    'https://blocmates.com/reviews/etherfi-cash-card-review',
    'https://cash.ether.fi',
    2024,
    TRUE,
    1
),

-- 2. Revolut
(
    '22222222-2222-2222-2222-222222222222',
    'Revolut',
    'revolut',
    'Revolut Ltd',
    'prepaid_debit',
    'both',
    ARRAY[]::TEXT[],
    'custodial',
    FALSE,
    NULL,
    NULL,
    TRUE,
    ARRAY['GB', 'US', 'DE', 'FR', 'ES', 'IT', 'NL', 'PL', 'PT', 'IE', 'BE', 'AT', 'SE', 'NO', 'DK', 'FI', 'AU', 'SG', 'JP', 'CH'],
    TRUE,
    TRUE,
    'https://blocmates.com/go/revolut',
    'revolut',
    '/images/cards/revolut.png',
    '/images/logos/revolut.svg',
    'The super-app for finance. Spend, exchange crypto, send money, and invest -- all from one account with competitive FX rates.',
    'Revolut is a global fintech app offering multi-currency accounts, crypto trading, stock investing, and international transfers. Their tiered card plans range from a free Standard account to the Ultra plan with premium perks. Revolut supports buying and selling 200+ cryptocurrencies with in-app exchange. Their RevPoints loyalty program rewards everyday spending with points redeemable for perks, flights, and account credit.',
    'https://blocmates.com/reviews/revolut-crypto-card-review',
    'https://www.revolut.com',
    2015,
    TRUE,
    2
),

-- 3. Cypher Card
(
    '33333333-3333-3333-3333-333333333333',
    'Cypher Card',
    'cypher-card',
    'Cypher Wallet Inc.',
    'self_custody',
    'visa',
    ARRAY['solana', 'ethereum'],
    'self_custody',
    FALSE,
    NULL,
    NULL,
    FALSE,
    ARRAY['US', 'GB', 'DE', 'FR', 'NL', 'CA', 'AU', 'SG'],
    FALSE,
    FALSE,
    'https://blocmates.com/go/cypher',
    'cypher',
    '/images/cards/cypher.png',
    '/images/logos/cypher.svg',
    'Spend directly from your self-custody wallet. No deposits, no custodians -- just tap and pay from your own wallet.',
    'Cypher Card connects directly to your self-custody wallet, enabling you to spend your crypto at any Visa merchant worldwide. There is no need to pre-load or deposit funds into a custodial account. When you tap to pay, Cypher settles the transaction in real-time from your on-chain balance. Supports Solana and Ethereum with gasless approvals. Your keys, your coins, your card.',
    'https://blocmates.com/reviews/cypher-card-review',
    'https://www.cyphercard.io',
    2024,
    TRUE,
    3
),

-- 4. Crypto.com
(
    '44444444-4444-4444-4444-444444444444',
    'Crypto.com',
    'crypto-com',
    'Crypto.com',
    'pure_rewards',
    'visa',
    ARRAY[]::TEXT[],
    'custodial',
    TRUE,
    'CRO',
    'crypto-com-chain',
    TRUE,
    ARRAY['US', 'GB', 'DE', 'FR', 'ES', 'IT', 'CA', 'AU', 'SG', 'BR', 'KR'],
    TRUE,
    TRUE,
    'https://blocmates.com/go/crypto-com',
    'crypto-com',
    '/images/cards/crypto-com.png',
    '/images/logos/crypto-com.svg',
    'Stake CRO for metal Visa cards earning up to 3% cashback. One of the most established crypto card programs in the industry.',
    'Crypto.com offers a range of metal Visa cards tied to CRO staking tiers. Higher CRO stakes unlock better cashback rates, airport lounge access, and subscription rebates. The card is funded by topping up from your Crypto.com wallet with 250+ supported cryptocurrencies or fiat. Cashback is paid in CRO and deposited directly into your wallet. The program has been running since 2018 and is available in 40+ countries.',
    'https://blocmates.com/reviews/crypto-com-visa-card-review',
    'https://crypto.com/cards',
    2018,
    TRUE,
    4
),

-- 5. Avici
(
    '55555555-5555-5555-5555-555555555555',
    'Avici',
    'avici',
    'Avici Labs',
    'self_custody',
    'mastercard',
    ARRAY['ethereum', 'polygon'],
    'self_custody',
    FALSE,
    NULL,
    NULL,
    FALSE,
    ARRAY['US', 'GB', 'DE', 'FR', 'NL', 'CH', 'AT', 'PT'],
    FALSE,
    FALSE,
    'https://blocmates.com/go/avici',
    'avici',
    '/images/cards/avici.png',
    '/images/logos/avici.svg',
    'Privacy-first Mastercard. No KYC, no data collection, no tracking. Spend from your own wallet with zero surveillance.',
    'Avici is a privacy-focused Mastercard that requires no KYC or personal data to activate. It connects to your self-custody Ethereum or Polygon wallet and settles payments using on-chain smart contracts with built-in privacy features. Transaction data is not stored or shared with third parties. The card uses stealth address technology and encrypted payment channels to protect your financial privacy while still working at any Mastercard terminal worldwide.',
    'https://blocmates.com/reviews/avici-card-review',
    'https://www.avici.xyz',
    2024,
    TRUE,
    5
);


-- ============================================================
-- TIERS
-- ============================================================

INSERT INTO tiers (
    id, card_id, name, slug, monthly_fee, annual_fee, fee_currency,
    staking_required, staking_amount, staking_token,
    tier_order, is_default, card_color,
    daily_spend_limit, monthly_spend_limit
) VALUES

-- EtherFi Cash tiers
(
    'aaaa0001-0000-0000-0000-000000000001',
    '11111111-1111-1111-1111-111111111111',
    'Standard',
    'standard',
    0.00, NULL, 'USD',
    FALSE, NULL, NULL,
    1, TRUE, '#1a1a2e',
    5000.00, 25000.00
),
(
    'aaaa0001-0000-0000-0000-000000000002',
    '11111111-1111-1111-1111-111111111111',
    'Premium',
    'premium',
    0.00, NULL, 'USD',
    FALSE, NULL, NULL,
    2, FALSE, '#c9a227',
    25000.00, 100000.00
),

-- Revolut tiers
(
    'bbbb0001-0000-0000-0000-000000000001',
    '22222222-2222-2222-2222-222222222222',
    'Standard',
    'standard',
    0.00, NULL, 'GBP',
    FALSE, NULL, NULL,
    1, TRUE, '#f5f5f5',
    10000.00, 30000.00
),
(
    'bbbb0001-0000-0000-0000-000000000002',
    '22222222-2222-2222-2222-222222222222',
    'Plus',
    'plus',
    3.99, NULL, 'GBP',
    FALSE, NULL, NULL,
    2, FALSE, '#e8e0d4',
    10000.00, 50000.00
),
(
    'bbbb0001-0000-0000-0000-000000000003',
    '22222222-2222-2222-2222-222222222222',
    'Premium',
    'premium',
    7.99, NULL, 'GBP',
    FALSE, NULL, NULL,
    3, FALSE, '#a0a0a0',
    15000.00, 75000.00
),
(
    'bbbb0001-0000-0000-0000-000000000004',
    '22222222-2222-2222-2222-222222222222',
    'Metal',
    'metal',
    14.99, NULL, 'GBP',
    FALSE, NULL, NULL,
    4, FALSE, '#2d2d2d',
    20000.00, 100000.00
),
(
    'bbbb0001-0000-0000-0000-000000000005',
    '22222222-2222-2222-2222-222222222222',
    'Ultra',
    'ultra',
    55.00, NULL, 'GBP',
    FALSE, NULL, NULL,
    5, FALSE, '#0a0a0a',
    50000.00, 200000.00
),

-- Cypher Card tier
(
    'cccc0001-0000-0000-0000-000000000001',
    '33333333-3333-3333-3333-333333333333',
    'Standard',
    'standard',
    0.00, NULL, 'USD',
    FALSE, NULL, NULL,
    1, TRUE, '#0d0d0d',
    10000.00, 50000.00
),

-- Crypto.com tiers
(
    'dddd0001-0000-0000-0000-000000000001',
    '44444444-4444-4444-4444-444444444444',
    'Midnight Blue',
    'midnight-blue',
    0.00, NULL, 'USD',
    FALSE, 0.00, NULL,
    1, TRUE, '#0b1354',
    5000.00, 25000.00
),
(
    'dddd0001-0000-0000-0000-000000000002',
    '44444444-4444-4444-4444-444444444444',
    'Ruby Steel',
    'ruby-steel',
    0.00, NULL, 'USD',
    TRUE, 400.00, 'CRO',
    2, FALSE, '#c9302c',
    10000.00, 50000.00
),
(
    'dddd0001-0000-0000-0000-000000000003',
    '44444444-4444-4444-4444-444444444444',
    'Jade Green',
    'jade-green',
    0.00, NULL, 'USD',
    TRUE, 4000.00, 'CRO',
    3, FALSE, '#00695c',
    15000.00, 75000.00
),

-- Avici tier
(
    'eeee0001-0000-0000-0000-000000000001',
    '55555555-5555-5555-5555-555555555555',
    'Standard',
    'standard',
    0.00, NULL, 'USD',
    FALSE, NULL, NULL,
    1, TRUE, '#1a1a1a',
    10000.00, 50000.00
);


-- ============================================================
-- FEES (one row per tier)
-- ============================================================

INSERT INTO fees (
    tier_id,
    fx_markup_percent, fx_free_limit_monthly, weekend_fx_surcharge,
    atm_fee_domestic, atm_fee_international, atm_fee_percent, atm_free_limit_monthly,
    topup_fee_crypto, topup_fee_bank, topup_fee_card,
    borrow_interest_rate, liquidation_threshold, min_collateral_ratio,
    inactivity_fee, card_replacement_fee, fee_notes
) VALUES

-- EtherFi Standard
(
    'aaaa0001-0000-0000-0000-000000000001',
    0.00, NULL, NULL,
    NULL, NULL, NULL, NULL,
    0.00, 0.00, NULL,
    5.50, 80.00, 150.00,
    NULL, 10.00,
    'Interest accrues on borrowed balance only. No monthly fees. Collateral ratio must stay above 150% to avoid liquidation.'
),
-- EtherFi Premium
(
    'aaaa0001-0000-0000-0000-000000000002',
    0.00, NULL, NULL,
    NULL, NULL, NULL, NULL,
    0.00, 0.00, NULL,
    3.90, 85.00, 130.00,
    NULL, 0.00,
    'Reduced borrow rate for balances over $10k collateral. Lower collateral ratio requirement. Free card replacement.'
),

-- Revolut Standard
(
    'bbbb0001-0000-0000-0000-000000000001',
    0.00, 1000.00, 1.00,
    NULL, NULL, 2.00, 200.00,
    1.99, 0.00, 0.00,
    NULL, NULL, NULL,
    NULL, 6.00,
    'FX free up to £1,000/mo then 0.5% markup. Weekend FX surcharge of 1% on major pairs. ATM free up to £200/mo then 2%.'
),
-- Revolut Plus
(
    'bbbb0001-0000-0000-0000-000000000002',
    0.00, 3000.00, 1.00,
    NULL, NULL, 2.00, 200.00,
    1.49, 0.00, 0.00,
    NULL, NULL, NULL,
    NULL, 6.00,
    'FX free up to £3,000/mo. Reduced crypto trading fees. Same ATM allowance as Standard.'
),
-- Revolut Premium
(
    'bbbb0001-0000-0000-0000-000000000003',
    0.00, NULL, 0.50,
    NULL, NULL, 2.00, 400.00,
    1.49, 0.00, 0.00,
    NULL, NULL, NULL,
    NULL, 0.00,
    'Unlimited FX during weekdays. 0.5% weekend surcharge on exotic pairs only. ATM free up to £400/mo. Free card replacement.'
),
-- Revolut Metal
(
    'bbbb0001-0000-0000-0000-000000000004',
    0.00, NULL, 0.00,
    NULL, NULL, 2.00, 800.00,
    0.99, 0.00, 0.00,
    NULL, NULL, NULL,
    NULL, 0.00,
    'Unlimited FX with no weekend surcharge. ATM free up to £800/mo. Crypto fees reduced to 0.99%. Free metal card replacement.'
),
-- Revolut Ultra
(
    'bbbb0001-0000-0000-0000-000000000005',
    0.00, NULL, 0.00,
    NULL, NULL, 0.00, 2000.00,
    0.49, 0.00, 0.00,
    NULL, NULL, NULL,
    NULL, 0.00,
    'Unlimited FX, no surcharges. ATM free up to £2,000/mo then 2%. Best crypto trading rate at 0.49%. All card fees waived.'
),

-- Cypher Standard
(
    'cccc0001-0000-0000-0000-000000000001',
    0.50, NULL, NULL,
    NULL, NULL, NULL, NULL,
    0.00, NULL, NULL,
    NULL, NULL, NULL,
    NULL, 10.00,
    'Flat 0.5% FX spread on conversions. No deposit or topup fees since spending is direct from wallet. Network gas fees apply for on-chain settlement.'
),

-- Crypto.com Midnight Blue
(
    'dddd0001-0000-0000-0000-000000000001',
    0.00, NULL, NULL,
    NULL, 2.00, 2.00, 200.00,
    0.00, 0.00, 0.00,
    NULL, NULL, NULL,
    NULL, 50.00,
    'No staking required. Free crypto top-ups. ATM withdrawal free up to $200/mo then 2%. Interbank FX rates.'
),
-- Crypto.com Ruby Steel
(
    'dddd0001-0000-0000-0000-000000000002',
    0.00, NULL, NULL,
    NULL, 2.00, 2.00, 400.00,
    0.00, 0.00, 0.00,
    NULL, NULL, NULL,
    NULL, 50.00,
    'Requires $400 CRO stake (180-day lock). ATM free up to $400/mo. Spotify rebate included.'
),
-- Crypto.com Jade Green
(
    'dddd0001-0000-0000-0000-000000000003',
    0.00, NULL, NULL,
    NULL, 2.00, 2.00, 800.00,
    0.00, 0.00, 0.00,
    NULL, NULL, NULL,
    NULL, 50.00,
    'Requires $4,000 CRO stake (180-day lock). ATM free up to $800/mo. Extra CRO staking rewards at 4% p.a.'
),

-- Avici Standard
(
    'eeee0001-0000-0000-0000-000000000001',
    0.80, NULL, NULL,
    NULL, NULL, NULL, NULL,
    0.00, NULL, NULL,
    NULL, NULL, NULL,
    NULL, 15.00,
    'Flat 0.8% spread on crypto-to-fiat conversion. No monthly fees. No hidden charges. Gas fees for on-chain settlement paid by user.'
);


-- ============================================================
-- REWARDS (one row per tier)
-- ============================================================

INSERT INTO rewards (
    tier_id,
    cashback_percent, cashback_max_monthly, cashback_currency, cashback_is_token,
    has_points_program, points_per_spend, points_spend_unit, points_currency, points_name,
    category_bonuses,
    is_promotional, promo_end_date, is_subsidized, rewards_source, reward_notes
) VALUES

-- EtherFi Standard
(
    'aaaa0001-0000-0000-0000-000000000001',
    0.50, 50.00, 'ETHFI', TRUE,
    FALSE, NULL, NULL, NULL, NULL,
    '[]'::JSONB,
    FALSE, NULL, FALSE, 'protocol_revenue',
    'Cashback paid in ETHFI tokens. Accrues monthly and is claimable on-chain.'
),
-- EtherFi Premium
(
    'aaaa0001-0000-0000-0000-000000000002',
    1.50, 200.00, 'ETHFI', TRUE,
    FALSE, NULL, NULL, NULL, NULL,
    '[{"category": "defi_protocols", "bonus_percent": 3.0, "description": "3% back on DeFi protocol subscriptions"}]'::JSONB,
    FALSE, NULL, FALSE, 'protocol_revenue',
    'Enhanced ETHFI cashback. 3x points on DeFi spending. Early access to EtherFi governance proposals.'
),

-- Revolut Standard
(
    'bbbb0001-0000-0000-0000-000000000001',
    0.00, NULL, NULL, FALSE,
    TRUE, 1.00, '1 GBP', 'GBP', 'RevPoints',
    '[]'::JSONB,
    FALSE, NULL, FALSE, 'company_funded',
    'Earn 1 RevPoint per £1 spent. Points can be redeemed for partner perks or account credit at variable rates.'
),
-- Revolut Plus
(
    'bbbb0001-0000-0000-0000-000000000002',
    0.00, NULL, NULL, FALSE,
    TRUE, 1.00, '1 GBP', 'GBP', 'RevPoints',
    '[]'::JSONB,
    FALSE, NULL, FALSE, 'company_funded',
    'Same RevPoints earn rate as Standard but with access to Plus-exclusive redemption offers.'
),
-- Revolut Premium
(
    'bbbb0001-0000-0000-0000-000000000003',
    0.00, NULL, NULL, FALSE,
    TRUE, 1.00, '1 GBP', 'GBP', 'RevPoints',
    '[{"category": "dining", "bonus_percent": 1.0, "description": "2x RevPoints at restaurants"}]'::JSONB,
    FALSE, NULL, FALSE, 'company_funded',
    '1 RevPoint per £1 with 2x multiplier on dining. Points redeemable for flights and hotel upgrades.'
),
-- Revolut Metal
(
    'bbbb0001-0000-0000-0000-000000000004',
    0.10, 15.00, 'GBP', FALSE,
    TRUE, 1.00, '1 GBP', 'GBP', 'RevPoints',
    '[{"category": "dining", "bonus_percent": 1.0, "description": "2x RevPoints at restaurants"}, {"category": "travel", "bonus_percent": 1.0, "description": "2x RevPoints on travel bookings"}]'::JSONB,
    FALSE, NULL, FALSE, 'company_funded',
    '0.1% cashback in fiat plus RevPoints. 2x multiplier on dining and travel. Priority customer support.'
),
-- Revolut Ultra
(
    'bbbb0001-0000-0000-0000-000000000005',
    1.00, 65.00, 'GBP', FALSE,
    TRUE, 1.50, '1 GBP', 'GBP', 'RevPoints',
    '[{"category": "dining", "bonus_percent": 2.0, "description": "3x RevPoints at restaurants"}, {"category": "travel", "bonus_percent": 2.0, "description": "3x RevPoints on travel bookings"}, {"category": "luxury", "bonus_percent": 2.0, "description": "3x RevPoints on luxury retailers"}]'::JSONB,
    FALSE, NULL, FALSE, 'company_funded',
    '1% cashback plus 1.5x base RevPoints earn rate. 3x on dining, travel, and luxury. Dedicated relationship manager.'
),

-- Cypher Standard
(
    'cccc0001-0000-0000-0000-000000000001',
    0.00, NULL, NULL, FALSE,
    FALSE, NULL, NULL, NULL, NULL,
    '[]'::JSONB,
    FALSE, NULL, FALSE, NULL,
    'No cashback or rewards program. The value proposition is self-custody spending with no intermediary.'
),

-- Crypto.com Midnight Blue
(
    'dddd0001-0000-0000-0000-000000000001',
    1.00, 25.00, 'CRO', TRUE,
    FALSE, NULL, NULL, NULL, NULL,
    '[]'::JSONB,
    FALSE, NULL, TRUE, 'token_subsidized',
    '1% cashback in CRO on all spending. No staking required. Monthly cap of $25 equivalent.'
),
-- Crypto.com Ruby Steel
(
    'dddd0001-0000-0000-0000-000000000002',
    2.00, 50.00, 'CRO', TRUE,
    FALSE, NULL, NULL, NULL, NULL,
    '[]'::JSONB,
    FALSE, NULL, TRUE, 'token_subsidized',
    '2% cashback in CRO. Requires $400 CRO stake. Includes 100% Spotify rebate (up to $14.99/mo) paid in CRO.'
),
-- Crypto.com Jade Green
(
    'dddd0001-0000-0000-0000-000000000003',
    3.00, 100.00, 'CRO', TRUE,
    FALSE, NULL, NULL, NULL, NULL,
    '[]'::JSONB,
    FALSE, NULL, TRUE, 'token_subsidized',
    '3% cashback in CRO. Requires $4,000 CRO stake. Includes Spotify + Netflix rebate. 4% p.a. on staked CRO.'
),

-- Avici Standard
(
    'eeee0001-0000-0000-0000-000000000001',
    0.00, NULL, NULL, FALSE,
    FALSE, NULL, NULL, NULL, NULL,
    '[]'::JSONB,
    FALSE, NULL, FALSE, NULL,
    'No rewards program. Avici focuses on privacy and self-custody, not incentive schemes.'
);


-- ============================================================
-- PERKS (3-5 per tier)
-- ============================================================

INSERT INTO perks (tier_id, perk_category, perk_name, perk_description, perk_value, display_order) VALUES

-- EtherFi Standard (3 perks)
('aaaa0001-0000-0000-0000-000000000001', 'defi_feature', 'Borrow Against Staked ETH', 'Use weETH or eETH as collateral to borrow USDC and spend on your card without selling your position.', NULL, 1),
('aaaa0001-0000-0000-0000-000000000001', 'yield', 'Continuous Staking Yield', 'Your collateral keeps earning ETH staking rewards (~3.5% APR) and EigenLayer restaking points while deposited.', NULL, 2),
('aaaa0001-0000-0000-0000-000000000001', 'defi_feature', 'Scroll L2 Settlement', 'Transactions settle on Scroll L2 for gas fees under $0.01 per transaction.', NULL, 3),

-- EtherFi Premium (5 perks)
('aaaa0001-0000-0000-0000-000000000002', 'defi_feature', 'Borrow Against Staked ETH', 'Use weETH or eETH as collateral to borrow USDC and spend on your card without selling your position.', NULL, 1),
('aaaa0001-0000-0000-0000-000000000002', 'yield', 'Enhanced Staking Yield', 'Premium collateral vaults with boosted EigenLayer allocation earning up to 5.2% APR.', NULL, 2),
('aaaa0001-0000-0000-0000-000000000002', 'defi_feature', 'Lower Liquidation Risk', 'Collateral ratio of 130% vs 150% on Standard, giving you more borrowing power per ETH deposited.', NULL, 3),
('aaaa0001-0000-0000-0000-000000000002', 'defi_feature', 'Flash Repayment', 'Repay your entire borrow balance in one transaction using flash loans -- no need to unwind positions manually.', NULL, 4),
('aaaa0001-0000-0000-0000-000000000002', 'other', 'Priority Support', 'Dedicated Telegram support channel with <1 hour response time for Premium cardholders.', NULL, 5),

-- Revolut Standard (3 perks)
('bbbb0001-0000-0000-0000-000000000001', 'transfers', 'Fee-Free Transfers', 'Send money to 150+ countries with competitive exchange rates. Free transfers up to £1,000/mo.', 1000.00, 1),
('bbbb0001-0000-0000-0000-000000000001', 'other', 'Budgeting Tools', 'Automatic spending categorization, monthly budgets, and spending analytics built into the app.', NULL, 2),
('bbbb0001-0000-0000-0000-000000000001', 'other', 'Crypto Trading', 'Buy and sell 200+ cryptocurrencies directly in the app with market and limit orders.', NULL, 3),

-- Revolut Plus (4 perks)
('bbbb0001-0000-0000-0000-000000000002', 'transfers', 'Fee-Free Transfers', 'Send money to 150+ countries. Free transfers up to £3,000/mo.', 3000.00, 1),
('bbbb0001-0000-0000-0000-000000000002', 'insurance', 'Purchase Protection', 'Refund protection on eligible purchases up to £1,000 for items damaged or stolen within 90 days.', 1000.00, 2),
('bbbb0001-0000-0000-0000-000000000002', 'other', 'Custom Card Design', 'Choose from exclusive card designs or create your own custom card artwork.', NULL, 3),
('bbbb0001-0000-0000-0000-000000000002', 'other', 'Crypto Trading', 'Buy and sell 200+ cryptocurrencies with reduced trading fees vs Standard.', NULL, 4),

-- Revolut Premium (5 perks)
('bbbb0001-0000-0000-0000-000000000003', 'transfers', 'Unlimited Fee-Free Transfers', 'Unlimited fee-free international transfers at interbank exchange rates on weekdays.', NULL, 1),
('bbbb0001-0000-0000-0000-000000000003', 'insurance', 'Travel Medical Insurance', 'Global travel medical insurance covering up to £10,000,000 per trip. Includes winter sports and adventure activities.', 10000000.00, 2),
('bbbb0001-0000-0000-0000-000000000003', 'insurance', 'Flight Delay Insurance', 'Compensation up to £500 for flight delays over 4 hours when flights are booked through Revolut or paid with the card.', 500.00, 3),
('bbbb0001-0000-0000-0000-000000000003', 'lounge_access', 'SmartDelay Lounge Access', 'Complimentary airport lounge access when your flight is delayed by 1+ hours. Available at 1,300+ lounges.', NULL, 4),
('bbbb0001-0000-0000-0000-000000000003', 'other', 'Disposable Virtual Cards', 'Generate single-use virtual card numbers for safer online shopping.', NULL, 5),

-- Revolut Metal (5 perks)
('bbbb0001-0000-0000-0000-000000000004', 'transfers', 'Unlimited Fee-Free Transfers', 'Unlimited fee-free international transfers at interbank rates with no weekend surcharges.', NULL, 1),
('bbbb0001-0000-0000-0000-000000000004', 'insurance', 'Comprehensive Travel Insurance', 'Full travel insurance package: medical (£10M), trip cancellation (£5,000), baggage delay (£500), and personal liability (£2M).', 10000000.00, 2),
('bbbb0001-0000-0000-0000-000000000004', 'lounge_access', 'LoungeKey Airport Lounges', 'Unlimited LoungeKey lounge access at 1,300+ airport lounges worldwide. Includes 1 guest per visit.', NULL, 3),
('bbbb0001-0000-0000-0000-000000000004', 'concierge', 'Concierge Service', '24/7 lifestyle concierge for restaurant reservations, event tickets, and travel bookings.', NULL, 4),
('bbbb0001-0000-0000-0000-000000000004', 'subscriptions', 'Exclusive Metal Card', 'Premium heavy metal card with exclusive engraved design. Stands out at every checkout.', NULL, 5),

-- Revolut Ultra (5 perks)
('bbbb0001-0000-0000-0000-000000000005', 'transfers', 'Unlimited Fee-Free Transfers', 'Unlimited international transfers at interbank rates. No markups, no surcharges, no limits.', NULL, 1),
('bbbb0001-0000-0000-0000-000000000005', 'lounge_access', 'Priority Pass Unlimited', 'Unlimited Priority Pass lounge access at 1,600+ lounges worldwide. Includes up to 3 guests per visit.', NULL, 2),
('bbbb0001-0000-0000-0000-000000000005', 'concierge', 'Dedicated Relationship Manager', 'Personal relationship manager available 24/7 for financial planning, complex transactions, and VIP requests.', NULL, 3),
('bbbb0001-0000-0000-0000-000000000005', 'insurance', 'Ultra Travel Insurance', 'Best-in-class travel insurance: medical (£10M), cancellation (£10,000), baggage (£3,000), winter sports, and adventure cover included.', 10000000.00, 4),
('bbbb0001-0000-0000-0000-000000000005', 'subscriptions', 'Partner Perks & Subscriptions', 'Monthly credits for WeWork, HelloFresh, and other premium partners. Rotating selection of exclusive offers.', 50.00, 5),

-- Cypher Standard (4 perks)
('cccc0001-0000-0000-0000-000000000001', 'defi_feature', 'Direct Wallet Spending', 'Spend directly from your Phantom, Backpack, or MetaMask wallet. No deposits or pre-loading required.', NULL, 1),
('cccc0001-0000-0000-0000-000000000001', 'privacy', 'No KYC Required', 'Get started with just a wallet connection. No identity documents, no selfies, no waiting period.', NULL, 2),
('cccc0001-0000-0000-0000-000000000001', 'defi_feature', 'Multi-Chain Support', 'Seamlessly switch between Solana and Ethereum assets. The card auto-routes to the best available liquidity.', NULL, 3),
('cccc0001-0000-0000-0000-000000000001', 'defi_feature', 'Gasless Approvals', 'Card transaction approvals are gasless -- Cypher covers the gas for payment signing transactions.', NULL, 4),

-- Crypto.com Midnight Blue (3 perks)
('dddd0001-0000-0000-0000-000000000001', 'other', 'Free Metal Card', 'Complimentary brushed stainless steel card in midnight blue finish. Stands out from typical plastic cards.', NULL, 1),
('dddd0001-0000-0000-0000-000000000001', 'other', 'Crypto Top-Up', 'Top up your card with 250+ supported cryptocurrencies or fiat via bank transfer or credit card.', NULL, 2),
('dddd0001-0000-0000-0000-000000000001', 'other', 'Interbank FX Rates', 'Spend in 30+ currencies at perfect interbank rates with no markup or hidden FX fees.', NULL, 3),

-- Crypto.com Ruby Steel (4 perks)
('dddd0001-0000-0000-0000-000000000002', 'subscriptions', 'Spotify Rebate', '100% rebate on Spotify subscription (up to $14.99/mo) paid back in CRO tokens.', 14.99, 1),
('dddd0001-0000-0000-0000-000000000002', 'other', 'Ruby Steel Metal Card', 'Eye-catching red metal card. Premium feel and durability.', NULL, 2),
('dddd0001-0000-0000-0000-000000000002', 'other', 'Interbank FX Rates', 'Spend in 30+ currencies at perfect interbank rates with no markup.', NULL, 3),
('dddd0001-0000-0000-0000-000000000002', 'other', 'Crypto Top-Up', 'Top up from your Crypto.com wallet with 250+ supported assets. Instant and fee-free.', NULL, 4),

-- Crypto.com Jade Green (5 perks)
('dddd0001-0000-0000-0000-000000000003', 'subscriptions', 'Spotify Rebate', '100% rebate on Spotify subscription (up to $14.99/mo) paid in CRO.', 14.99, 1),
('dddd0001-0000-0000-0000-000000000003', 'subscriptions', 'Netflix Rebate', '100% rebate on Netflix subscription (up to $15.49/mo) paid in CRO.', 15.49, 2),
('dddd0001-0000-0000-0000-000000000003', 'lounge_access', 'LoungeKey Access', 'Complimentary LoungeKey airport lounge access at 1,100+ lounges worldwide.', NULL, 3),
('dddd0001-0000-0000-0000-000000000003', 'yield', 'CRO Staking Rewards', 'Earn 4% p.a. on your $4,000 CRO stake, paid weekly in CRO directly to your wallet.', NULL, 4),
('dddd0001-0000-0000-0000-000000000003', 'other', 'Jade Green Metal Card', 'Distinctive jade green metal card. Premium unboxing experience included.', NULL, 5),

-- Avici Standard (4 perks)
('eeee0001-0000-0000-0000-000000000001', 'privacy', 'No KYC Required', 'Fully functional card with no identity verification. Connect a wallet and start spending immediately.', NULL, 1),
('eeee0001-0000-0000-0000-000000000001', 'privacy', 'Stealth Addresses', 'Each transaction uses a fresh stealth address so your spending history cannot be linked to your wallet.', NULL, 2),
('eeee0001-0000-0000-0000-000000000001', 'privacy', 'Zero Data Collection', 'Avici does not store, sell, or share any transaction data or personal information. No analytics, no tracking.', NULL, 3),
('eeee0001-0000-0000-0000-000000000001', 'defi_feature', 'Multi-Chain Self-Custody', 'Spend from your Ethereum or Polygon wallet. Smart contract settlement ensures you never lose custody of funds until the moment of payment.', NULL, 4);


-- ============================================================
-- SUPPORTED ASSETS (3-5 per card)
-- ============================================================

INSERT INTO supported_assets (card_id, asset_name, asset_ticker, can_spend, can_hold, can_collateralize) VALUES

-- EtherFi Cash (5 assets)
('11111111-1111-1111-1111-111111111111', 'Ethereum',            'ETH',   FALSE, TRUE,  TRUE),
('11111111-1111-1111-1111-111111111111', 'Wrapped eETH',        'weETH', FALSE, TRUE,  TRUE),
('11111111-1111-1111-1111-111111111111', 'ether.fi Staked ETH', 'eETH',  FALSE, TRUE,  TRUE),
('11111111-1111-1111-1111-111111111111', 'USD Coin',            'USDC',  TRUE,  TRUE,  FALSE),
('11111111-1111-1111-1111-111111111111', 'Tether',              'USDT',  TRUE,  TRUE,  FALSE),

-- Revolut (5 assets)
('22222222-2222-2222-2222-222222222222', 'Bitcoin',  'BTC',  TRUE, TRUE, FALSE),
('22222222-2222-2222-2222-222222222222', 'Ethereum', 'ETH',  TRUE, TRUE, FALSE),
('22222222-2222-2222-2222-222222222222', 'Solana',   'SOL',  TRUE, TRUE, FALSE),
('22222222-2222-2222-2222-222222222222', 'XRP',      'XRP',  TRUE, TRUE, FALSE),
('22222222-2222-2222-2222-222222222222', 'Dogecoin', 'DOGE', TRUE, TRUE, FALSE),

-- Cypher Card (4 assets)
('33333333-3333-3333-3333-333333333333', 'Solana',   'SOL',  TRUE, TRUE, FALSE),
('33333333-3333-3333-3333-333333333333', 'Ethereum', 'ETH',  TRUE, TRUE, FALSE),
('33333333-3333-3333-3333-333333333333', 'USD Coin', 'USDC', TRUE, TRUE, FALSE),
('33333333-3333-3333-3333-333333333333', 'Tether',   'USDT', TRUE, TRUE, FALSE),

-- Crypto.com (5 assets)
('44444444-4444-4444-4444-444444444444', 'Bitcoin',  'BTC',  TRUE, TRUE, FALSE),
('44444444-4444-4444-4444-444444444444', 'Ethereum', 'ETH',  TRUE, TRUE, FALSE),
('44444444-4444-4444-4444-444444444444', 'Cronos',   'CRO',  TRUE, TRUE, FALSE),
('44444444-4444-4444-4444-444444444444', 'USD Coin', 'USDC', TRUE, TRUE, FALSE),
('44444444-4444-4444-4444-444444444444', 'Tether',   'USDT', TRUE, TRUE, FALSE),

-- Avici (5 assets)
('55555555-5555-5555-5555-555555555555', 'Ethereum', 'ETH',   TRUE, TRUE, FALSE),
('55555555-5555-5555-5555-555555555555', 'USD Coin', 'USDC',  TRUE, TRUE, FALSE),
('55555555-5555-5555-5555-555555555555', 'Tether',   'USDT',  TRUE, TRUE, FALSE),
('55555555-5555-5555-5555-555555555555', 'Polygon',  'MATIC', TRUE, TRUE, FALSE),
('55555555-5555-5555-5555-555555555555', 'Dai',      'DAI',   TRUE, TRUE, FALSE);

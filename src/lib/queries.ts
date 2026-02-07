import { supabase, getServiceClient } from "./supabase";
import type { CardWithDetails, CardPreviewData, TierCard, TierCardPreview } from "./types";

export async function getAllCards(): Promise<CardPreviewData[]> {
  const { data: cards, error } = await supabase
    .from("cards")
    .select(
      `
      id,
      name,
      slug,
      issuer,
      card_type,
      card_network,
      custody_model,
      supported_chains,
      card_image_url,
      logo_url,
      description,
      ref_link,
      has_native_token,
      token_ticker,
      display_order,
      tiers (
        id,
        name,
        monthly_fee,
        is_default,
        tier_order,
        fees (
          fx_markup_percent
        ),
        rewards (
          cashback_percent
        )
      )
    `
    )
    .eq("is_active", true)
    .order("display_order", { ascending: true });

  if (error) {
    console.error("Error fetching cards:", error);
    return [];
  }

  return (cards || []).map((card: any) => {
    const defaultTier =
      card.tiers?.find((t: any) => t.is_default) ||
      card.tiers?.sort((a: any, b: any) => a.tier_order - b.tier_order)[0];

    return {
      id: card.id,
      name: card.name,
      slug: card.slug,
      issuer: card.issuer,
      card_type: card.card_type,
      card_network: card.card_network,
      custody_model: card.custody_model,
      supported_chains: card.supported_chains || [],
      card_image_url: card.card_image_url,
      logo_url: card.logo_url,
      description: card.description,
      ref_link: card.ref_link,
      has_native_token: card.has_native_token,
      token_ticker: card.token_ticker,
      display_order: card.display_order,
      default_tier_name: defaultTier?.name || null,
      monthly_fee: defaultTier?.monthly_fee || 0,
      cashback_percent: defaultTier?.rewards?.[0]?.cashback_percent ?? null,
      fx_markup_percent: defaultTier?.fees?.[0]?.fx_markup_percent ?? null,
    };
  });
}

export async function getCardBySlug(
  slug: string
): Promise<CardWithDetails | null> {
  const { data: card, error } = await supabase
    .from("cards")
    .select(
      `
      *,
      tiers (
        *,
        fees (*),
        rewards (*),
        perks (*)
      ),
      supported_assets (*)
    `
    )
    .eq("slug", slug)
    .single();

  if (error || !card) {
    console.error("Error fetching card:", error);
    return null;
  }

  // Normalize tiers: fees and rewards come as arrays from Supabase, take first element
  const tiers = (card.tiers || [])
    .sort((a: any, b: any) => a.tier_order - b.tier_order)
    .map((tier: any) => ({
      ...tier,
      fees: tier.fees?.[0] || null,
      rewards: tier.rewards?.[0] || null,
      perks: (tier.perks || []).sort(
        (a: any, b: any) => a.display_order - b.display_order
      ),
    }));

  return {
    ...card,
    tiers,
    supported_assets: card.supported_assets || [],
  } as CardWithDetails;
}

export async function getCardsForComparison(
  cardIds: string[]
): Promise<CardWithDetails[]> {
  const { data: cards, error } = await supabase
    .from("cards")
    .select(
      `
      *,
      tiers (
        *,
        fees (*),
        rewards (*),
        perks (*)
      ),
      supported_assets (*)
    `
    )
    .in("id", cardIds);

  if (error || !cards) {
    console.error("Error fetching comparison cards:", error);
    return [];
  }

  return cards.map((card: any) => {
    const tiers = (card.tiers || [])
      .sort((a: any, b: any) => a.tier_order - b.tier_order)
      .map((tier: any) => ({
        ...tier,
        fees: tier.fees?.[0] || null,
        rewards: tier.rewards?.[0] || null,
        perks: (tier.perks || []).sort(
          (a: any, b: any) => a.display_order - b.display_order
        ),
      }));

    return {
      ...card,
      tiers,
      supported_assets: card.supported_assets || [],
    } as CardWithDetails;
  });
}

export async function trackRefClick(
  cardId: string,
  source: string
): Promise<void> {
  await supabase.from("ref_clicks").insert({
    card_id: cardId,
    source,
  });
}

// ---- Tier-split helpers ----

function makeTierSlug(cardSlug: string, tierSlug: string, tierCount: number): string {
  return tierCount > 1 ? `${cardSlug}-${tierSlug}` : cardSlug;
}

function makeTierDisplayName(cardName: string, tierName: string, tierCount: number): string {
  return tierCount > 1 ? `${cardName} ${tierName}` : cardName;
}

/** Flatten all cards into individual tier entries for browse/quiz */
export async function getAllTierCards(): Promise<TierCardPreview[]> {
  const { data: cards, error } = await supabase
    .from("cards")
    .select(
      `
      id, name, slug, issuer, card_type, card_network, custody_model,
      supported_chains, supported_countries, apple_pay, google_pay,
      kyc_required, card_image_url, logo_url, description, ref_link,
      has_native_token, token_ticker, display_order,
      tiers (
        id, name, slug, monthly_fee, annual_fee, card_color,
        staking_required, staking_amount, staking_token,
        is_default, tier_order,
        fees ( fx_markup_percent ),
        rewards ( cashback_percent )
      )
    `
    )
    .eq("is_active", true)
    .order("display_order", { ascending: true });

  if (error) {
    console.error("Error fetching tier cards:", error);
    return [];
  }

  const result: TierCardPreview[] = [];

  for (const card of cards || []) {
    const tiers = (card.tiers || []).sort(
      (a: any, b: any) => a.tier_order - b.tier_order
    );
    const tierCount = tiers.length;

    for (const tier of tiers) {
      result.push({
        tierId: tier.id,
        cardId: card.id,
        slug: makeTierSlug(card.slug, tier.slug, tierCount),
        displayName: makeTierDisplayName(card.name, tier.name, tierCount),
        issuer: card.issuer,
        description: card.description,
        card_type: card.card_type,
        card_network: card.card_network,
        custody_model: card.custody_model,
        supported_chains: card.supported_chains || [],
        supported_countries: card.supported_countries || [],
        apple_pay: card.apple_pay,
        google_pay: card.google_pay,
        kyc_required: card.kyc_required,
        card_image_url: card.card_image_url,
        logo_url: card.logo_url,
        card_color: tier.card_color,
        ref_link: card.ref_link,
        tierName: tier.name,
        monthly_fee: tier.monthly_fee,
        cashback_percent: tier.rewards?.[0]?.cashback_percent ?? null,
        fx_markup_percent: tier.fees?.[0]?.fx_markup_percent ?? null,
        staking_required: tier.staking_required,
        staking_amount: tier.staking_amount,
        staking_token: tier.staking_token,
        display_order: card.display_order,
        tier_order: tier.tier_order,
      });
    }
  }

  // Interleave: avoid same-provider tiers appearing back to back
  return interleaveTierCards(result);
}

/** Interleave tier cards so same-provider tiers don't appear consecutively */
function interleaveTierCards(cards: TierCardPreview[]): TierCardPreview[] {
  // Group by cardId
  const groups = new Map<string, TierCardPreview[]>();
  for (const card of cards) {
    const group = groups.get(card.cardId) || [];
    group.push(card);
    groups.set(card.cardId, group);
  }

  const result: TierCardPreview[] = [];
  const queues = Array.from(groups.values());

  // Round-robin through providers
  let added = true;
  while (added) {
    added = false;
    for (const queue of queues) {
      if (queue.length > 0) {
        result.push(queue.shift()!);
        added = true;
      }
    }
  }

  return result;
}

/** Get a single tier-card by its combined slug */
export async function getTierCardBySlug(slug: string): Promise<TierCard | null> {
  // First try exact card slug match (for single-tier cards)
  const { data: cards, error } = await supabase
    .from("cards")
    .select(
      `
      *,
      tiers (
        *,
        fees (*),
        rewards (*),
        perks (*)
      ),
      supported_assets (*)
    `
    )
    .eq("is_active", true);

  if (error || !cards) {
    console.error("Error fetching tier card:", error);
    return null;
  }

  for (const card of cards) {
    const tiers = (card.tiers || [])
      .sort((a: any, b: any) => a.tier_order - b.tier_order)
      .map((tier: any) => ({
        ...tier,
        fees: tier.fees?.[0] || null,
        rewards: tier.rewards?.[0] || null,
        perks: (tier.perks || []).sort(
          (a: any, b: any) => a.display_order - b.display_order
        ),
      }));
    const tierCount = tiers.length;

    for (const tier of tiers) {
      const tierSlug = makeTierSlug(card.slug, tier.slug, tierCount);
      if (tierSlug === slug) {
        return {
          tierId: tier.id,
          cardId: card.id,
          slug: tierSlug,
          displayName: makeTierDisplayName(card.name, tier.name, tierCount),
          issuer: card.issuer,
          card_type: card.card_type,
          card_network: card.card_network,
          custody_model: card.custody_model,
          supported_chains: card.supported_chains || [],
          supported_countries: card.supported_countries || [],
          kyc_required: card.kyc_required,
          apple_pay: card.apple_pay,
          google_pay: card.google_pay,
          has_native_token: card.has_native_token,
          token_ticker: card.token_ticker,
          description: card.description,
          long_description: card.long_description,
          card_image_url: card.card_image_url,
          logo_url: card.logo_url,
          ref_link: card.ref_link,
          ref_link_slug: card.ref_link_slug,
          website_url: card.website_url,
          blocmates_article_url: card.blocmates_article_url,
          year_launched: card.year_launched,
          tierName: tier.name,
          monthly_fee: tier.monthly_fee,
          annual_fee: tier.annual_fee,
          staking_required: tier.staking_required,
          staking_amount: tier.staking_amount,
          staking_token: tier.staking_token,
          card_color: tier.card_color,
          fees: tier.fees,
          rewards: tier.rewards,
          perks: tier.perks,
          supported_assets: card.supported_assets || [],
          display_order: card.display_order,
          tier_order: tier.tier_order,
        };
      }
    }
  }

  return null;
}

/** Get multiple tier-cards by their composite slugs (for compare) */
export async function getTierCardsBySlugs(slugs: string[]): Promise<TierCard[]> {
  const { data: cards, error } = await supabase
    .from("cards")
    .select(
      `
      *,
      tiers (
        *,
        fees (*),
        rewards (*),
        perks (*)
      ),
      supported_assets (*)
    `
    )
    .eq("is_active", true);

  if (error || !cards) {
    console.error("Error fetching tier cards for comparison:", error);
    return [];
  }

  const result: TierCard[] = [];
  const slugSet = new Set(slugs);

  for (const card of cards) {
    const tiers = (card.tiers || [])
      .sort((a: any, b: any) => a.tier_order - b.tier_order)
      .map((tier: any) => ({
        ...tier,
        fees: tier.fees?.[0] || null,
        rewards: tier.rewards?.[0] || null,
        perks: (tier.perks || []).sort(
          (a: any, b: any) => a.display_order - b.display_order
        ),
      }));
    const tierCount = tiers.length;

    for (const tier of tiers) {
      const tierSlug = makeTierSlug(card.slug, tier.slug, tierCount);
      if (slugSet.has(tierSlug)) {
        result.push({
          tierId: tier.id,
          cardId: card.id,
          slug: tierSlug,
          displayName: makeTierDisplayName(card.name, tier.name, tierCount),
          issuer: card.issuer,
          card_type: card.card_type,
          card_network: card.card_network,
          custody_model: card.custody_model,
          supported_chains: card.supported_chains || [],
          supported_countries: card.supported_countries || [],
          kyc_required: card.kyc_required,
          apple_pay: card.apple_pay,
          google_pay: card.google_pay,
          has_native_token: card.has_native_token,
          token_ticker: card.token_ticker,
          description: card.description,
          long_description: card.long_description,
          card_image_url: card.card_image_url,
          logo_url: card.logo_url,
          ref_link: card.ref_link,
          ref_link_slug: card.ref_link_slug,
          website_url: card.website_url,
          blocmates_article_url: card.blocmates_article_url,
          year_launched: card.year_launched,
          tierName: tier.name,
          monthly_fee: tier.monthly_fee,
          annual_fee: tier.annual_fee,
          staking_required: tier.staking_required,
          staking_amount: tier.staking_amount,
          staking_token: tier.staking_token,
          card_color: tier.card_color,
          fees: tier.fees,
          rewards: tier.rewards,
          perks: tier.perks,
          supported_assets: card.supported_assets || [],
          display_order: card.display_order,
          tier_order: tier.tier_order,
        });
      }
    }
  }

  return result;
}

// Admin queries (use service role key)
export async function adminGetAllCards() {
  const client = getServiceClient();
  const { data, error } = await client
    .from("cards")
    .select(
      `
      *,
      tiers (
        id,
        name,
        tier_order,
        monthly_fee,
        is_default
      )
    `
    )
    .order("display_order", { ascending: true });

  if (error) {
    console.error("Error fetching admin cards:", error);
    return [];
  }
  return data || [];
}

export async function adminDeleteCard(cardId: string) {
  const client = getServiceClient();
  const { error } = await client.from("cards").delete().eq("id", cardId);
  if (error) throw error;
}

export async function adminUpsertCard(cardData: any) {
  const client = getServiceClient();
  const { tiers, supported_assets, ...card } = cardData;

  // Upsert the card
  const { data: savedCard, error: cardError } = await client
    .from("cards")
    .upsert(card)
    .select()
    .single();

  if (cardError) throw cardError;

  // Handle tiers
  if (tiers && savedCard) {
    for (const tier of tiers) {
      const { fees, rewards, perks, ...tierData } = tier;
      tierData.card_id = savedCard.id;

      const { data: savedTier, error: tierError } = await client
        .from("tiers")
        .upsert(tierData)
        .select()
        .single();

      if (tierError) throw tierError;

      if (fees && savedTier) {
        fees.tier_id = savedTier.id;
        await client.from("fees").upsert(fees);
      }

      if (rewards && savedTier) {
        rewards.tier_id = savedTier.id;
        await client.from("rewards").upsert(rewards);
      }

      if (perks && savedTier) {
        // Delete existing perks and re-insert
        await client.from("perks").delete().eq("tier_id", savedTier.id);
        const perksWithTierId = perks.map((p: any) => ({
          ...p,
          tier_id: savedTier.id,
        }));
        if (perksWithTierId.length > 0) {
          await client.from("perks").insert(perksWithTierId);
        }
      }
    }
  }

  // Handle supported assets
  if (supported_assets && savedCard) {
    await client
      .from("supported_assets")
      .delete()
      .eq("card_id", savedCard.id);
    const assetsWithCardId = supported_assets.map((a: any) => ({
      ...a,
      card_id: savedCard.id,
    }));
    if (assetsWithCardId.length > 0) {
      await client.from("supported_assets").insert(assetsWithCardId);
    }
  }

  return savedCard;
}

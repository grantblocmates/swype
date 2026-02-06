"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Plus,
  Trash2,
  ChevronDown,
  ChevronUp,
  Save,
  Loader2,
} from "lucide-react";

interface TierForm {
  id?: string;
  name: string;
  slug: string;
  monthly_fee: number;
  annual_fee: number | null;
  fee_currency: string;
  staking_required: boolean;
  staking_amount: number | null;
  staking_token: string;
  tier_order: number;
  is_default: boolean;
  card_color: string;
  daily_spend_limit: number | null;
  monthly_spend_limit: number | null;
  fees: {
    id?: string;
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
    fee_notes: string;
  };
  rewards: {
    id?: string;
    cashback_percent: number | null;
    cashback_max_monthly: number | null;
    cashback_currency: string;
    cashback_is_token: boolean;
    has_points_program: boolean;
    points_per_spend: number | null;
    points_spend_unit: number | null;
    points_currency: string;
    points_name: string;
    is_promotional: boolean;
    is_subsidized: boolean;
    rewards_source: string;
    reward_notes: string;
  };
  perks: {
    id?: string;
    perk_category: string;
    perk_name: string;
    perk_description: string;
    perk_value: string;
    display_order: number;
  }[];
  _expanded?: boolean;
}

function emptyTier(order: number): TierForm {
  return {
    name: "",
    slug: "",
    monthly_fee: 0,
    annual_fee: null,
    fee_currency: "USD",
    staking_required: false,
    staking_amount: null,
    staking_token: "",
    tier_order: order,
    is_default: order === 0,
    card_color: "",
    daily_spend_limit: null,
    monthly_spend_limit: null,
    fees: {
      fx_markup_percent: null,
      fx_free_limit_monthly: null,
      weekend_fx_surcharge: null,
      atm_fee_domestic: null,
      atm_fee_international: null,
      atm_fee_percent: null,
      atm_free_limit_monthly: null,
      topup_fee_crypto: null,
      topup_fee_bank: null,
      topup_fee_card: null,
      borrow_interest_rate: null,
      liquidation_threshold: null,
      min_collateral_ratio: null,
      inactivity_fee: null,
      card_replacement_fee: null,
      fee_notes: "",
    },
    rewards: {
      cashback_percent: null,
      cashback_max_monthly: null,
      cashback_currency: "USD",
      cashback_is_token: false,
      has_points_program: false,
      points_per_spend: null,
      points_spend_unit: null,
      points_currency: "",
      points_name: "",
      is_promotional: false,
      is_subsidized: false,
      rewards_source: "",
      reward_notes: "",
    },
    perks: [],
    _expanded: true,
  };
}

interface AdminCardFormProps {
  initialData?: any;
}

export default function AdminCardForm({ initialData }: AdminCardFormProps) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);

  const [card, setCard] = useState({
    id: initialData?.id || undefined,
    name: initialData?.name || "",
    slug: initialData?.slug || "",
    issuer: initialData?.issuer || "",
    card_type: initialData?.card_type || "prepaid_debit",
    card_network: initialData?.card_network || "visa",
    supported_chains: initialData?.supported_chains || [],
    custody_model: initialData?.custody_model || "custodial",
    has_native_token: initialData?.has_native_token || false,
    token_ticker: initialData?.token_ticker || "",
    token_coingecko_id: initialData?.token_coingecko_id || "",
    kyc_required: initialData?.kyc_required ?? true,
    supported_countries: initialData?.supported_countries || [],
    apple_pay: initialData?.apple_pay || false,
    google_pay: initialData?.google_pay || false,
    ref_link: initialData?.ref_link || "",
    ref_link_slug: initialData?.ref_link_slug || "",
    card_image_url: initialData?.card_image_url || "",
    logo_url: initialData?.logo_url || "",
    description: initialData?.description || "",
    long_description: initialData?.long_description || "",
    blocmates_article_url: initialData?.blocmates_article_url || "",
    website_url: initialData?.website_url || "",
    year_launched: initialData?.year_launched || null,
    is_active: initialData?.is_active ?? true,
    display_order: initialData?.display_order || 0,
  });

  const [tiers, setTiers] = useState<TierForm[]>(
    initialData?.tiers?.length > 0
      ? initialData.tiers.map((t: any, i: number) => ({
          ...t,
          fees: t.fees || emptyTier(i).fees,
          rewards: t.rewards || emptyTier(i).rewards,
          perks: t.perks || [],
          _expanded: false,
        }))
      : [emptyTier(0)]
  );

  const [chainsInput, setChainsInput] = useState(
    (card.supported_chains || []).join(", ")
  );
  const [countriesInput, setCountriesInput] = useState(
    (card.supported_countries || []).join(", ")
  );

  function updateCard(field: string, value: any) {
    setCard((prev: any) => ({ ...prev, [field]: value }));
  }

  function updateTier(index: number, field: string, value: any) {
    setTiers((prev) =>
      prev.map((t, i) => (i === index ? { ...t, [field]: value } : t))
    );
  }

  function updateTierFees(index: number, field: string, value: any) {
    setTiers((prev) =>
      prev.map((t, i) =>
        i === index ? { ...t, fees: { ...t.fees, [field]: value } } : t
      )
    );
  }

  function updateTierRewards(index: number, field: string, value: any) {
    setTiers((prev) =>
      prev.map((t, i) =>
        i === index
          ? { ...t, rewards: { ...t.rewards, [field]: value } }
          : t
      )
    );
  }

  function addPerk(tierIndex: number) {
    setTiers((prev) =>
      prev.map((t, i) =>
        i === tierIndex
          ? {
              ...t,
              perks: [
                ...t.perks,
                {
                  perk_category: "other",
                  perk_name: "",
                  perk_description: "",
                  perk_value: "",
                  display_order: t.perks.length,
                },
              ],
            }
          : t
      )
    );
  }

  function removePerk(tierIndex: number, perkIndex: number) {
    setTiers((prev) =>
      prev.map((t, i) =>
        i === tierIndex
          ? { ...t, perks: t.perks.filter((_, pi) => pi !== perkIndex) }
          : t
      )
    );
  }

  function updatePerk(
    tierIndex: number,
    perkIndex: number,
    field: string,
    value: any
  ) {
    setTiers((prev) =>
      prev.map((t, i) =>
        i === tierIndex
          ? {
              ...t,
              perks: t.perks.map((p, pi) =>
                pi === perkIndex ? { ...p, [field]: value } : p
              ),
            }
          : t
      )
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);

    try {
      const payload = {
        ...card,
        supported_chains: chainsInput
          .split(",")
          .map((s: string) => s.trim())
          .filter(Boolean),
        supported_countries: countriesInput
          .split(",")
          .map((s: string) => s.trim())
          .filter(Boolean),
        tiers: tiers.map(({ _expanded, ...t }) => t),
      };

      const res = await fetch("/api/admin/cards", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to save");
      }

      router.push("/admin");
    } catch (err: any) {
      alert(err.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-3xl mx-auto p-4 md:p-8">
      <h1 className="text-xl font-bold text-white mb-8">
        {initialData ? "Edit Card" : "Add New Card"}
      </h1>

      {/* Card Basics */}
      <FormSection title="Card Basics">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field
            label="Name *"
            value={card.name}
            onChange={(v) => updateCard("name", v)}
            required
          />
          <Field
            label="Slug *"
            value={card.slug}
            onChange={(v) => updateCard("slug", v)}
            placeholder="url-friendly-name"
            required
          />
          <Field
            label="Issuer *"
            value={card.issuer}
            onChange={(v) => updateCard("issuer", v)}
            required
          />
          <Select
            label="Card Type *"
            value={card.card_type}
            onChange={(v) => updateCard("card_type", v)}
            options={[
              { value: "prepaid_debit", label: "Prepaid Debit" },
              { value: "pure_rewards", label: "Pure Rewards" },
              { value: "collateralized_defi", label: "Collateralized DeFi" },
              { value: "self_custody", label: "Self-Custody" },
            ]}
          />
          <Select
            label="Card Network *"
            value={card.card_network}
            onChange={(v) => updateCard("card_network", v)}
            options={[
              { value: "visa", label: "Visa" },
              { value: "mastercard", label: "Mastercard" },
              { value: "both", label: "Both" },
            ]}
          />
          <Select
            label="Custody Model"
            value={card.custody_model}
            onChange={(v) => updateCard("custody_model", v)}
            options={[
              { value: "custodial", label: "Custodial" },
              { value: "self_custody", label: "Self-Custody" },
              { value: "hybrid", label: "Hybrid" },
            ]}
          />
        </div>
      </FormSection>

      {/* Chains & Countries */}
      <FormSection title="Networks & Regions">
        <Field
          label="Supported Chains (comma separated)"
          value={chainsInput}
          onChange={setChainsInput}
          placeholder="ethereum, base, solana"
        />
        <Field
          label="Supported Countries (ISO codes, comma separated)"
          value={countriesInput}
          onChange={setCountriesInput}
          placeholder="US, GB, DE, PT"
        />
        <div className="grid grid-cols-2 gap-4 mt-3">
          <Checkbox
            label="KYC Required"
            checked={card.kyc_required}
            onChange={(v) => updateCard("kyc_required", v)}
          />
          <Checkbox
            label="Apple Pay"
            checked={card.apple_pay}
            onChange={(v) => updateCard("apple_pay", v)}
          />
          <Checkbox
            label="Google Pay"
            checked={card.google_pay}
            onChange={(v) => updateCard("google_pay", v)}
          />
          <Checkbox
            label="Active"
            checked={card.is_active}
            onChange={(v) => updateCard("is_active", v)}
          />
        </div>
      </FormSection>

      {/* Token Info */}
      <FormSection title="Token Info">
        <Checkbox
          label="Has Native Token"
          checked={card.has_native_token}
          onChange={(v) => updateCard("has_native_token", v)}
        />
        {card.has_native_token && (
          <div className="grid grid-cols-2 gap-4 mt-3">
            <Field
              label="Token Ticker"
              value={card.token_ticker}
              onChange={(v) => updateCard("token_ticker", v)}
              placeholder="ETHFI"
            />
            <Field
              label="CoinGecko ID"
              value={card.token_coingecko_id}
              onChange={(v) => updateCard("token_coingecko_id", v)}
              placeholder="ether-fi"
            />
          </div>
        )}
      </FormSection>

      {/* Referral & Links */}
      <FormSection title="Referral & Links">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field
            label="Referral Link"
            value={card.ref_link}
            onChange={(v) => updateCard("ref_link", v)}
            placeholder="https://..."
          />
          <Field
            label="Ref Slug"
            value={card.ref_link_slug}
            onChange={(v) => updateCard("ref_link_slug", v)}
            placeholder="etherfi"
          />
          <Field
            label="Card Image URL"
            value={card.card_image_url}
            onChange={(v) => updateCard("card_image_url", v)}
          />
          <Field
            label="Logo URL"
            value={card.logo_url}
            onChange={(v) => updateCard("logo_url", v)}
          />
          <Field
            label="Website URL"
            value={card.website_url}
            onChange={(v) => updateCard("website_url", v)}
          />
          <Field
            label="Blocmates Article URL"
            value={card.blocmates_article_url}
            onChange={(v) => updateCard("blocmates_article_url", v)}
          />
          <Field
            label="Year Launched"
            value={card.year_launched?.toString() || ""}
            onChange={(v) =>
              updateCard("year_launched", v ? parseInt(v) : null)
            }
            type="number"
          />
          <Field
            label="Display Order"
            value={card.display_order.toString()}
            onChange={(v) => updateCard("display_order", parseInt(v) || 0)}
            type="number"
          />
        </div>
      </FormSection>

      {/* Descriptions */}
      <FormSection title="Descriptions">
        <TextArea
          label="Short Description"
          value={card.description}
          onChange={(v) => updateCard("description", v)}
          rows={2}
        />
        <TextArea
          label="Long Description"
          value={card.long_description}
          onChange={(v) => updateCard("long_description", v)}
          rows={4}
        />
      </FormSection>

      {/* Tiers */}
      <FormSection title="Tiers">
        {tiers.map((tier, ti) => (
          <div
            key={ti}
            className="bg-white/5 border border-white/10 rounded-xl mb-4"
          >
            <button
              type="button"
              onClick={() =>
                setTiers((prev) =>
                  prev.map((t, i) =>
                    i === ti ? { ...t, _expanded: !t._expanded } : t
                  )
                )
              }
              className="w-full flex items-center justify-between p-4"
            >
              <span className="text-sm font-semibold text-white">
                {tier.name || `Tier ${ti + 1}`}
                {tier.is_default && (
                  <span className="ml-2 text-xs text-accent">(default)</span>
                )}
              </span>
              {tier._expanded ? (
                <ChevronUp className="w-4 h-4 text-zinc-400" />
              ) : (
                <ChevronDown className="w-4 h-4 text-zinc-400" />
              )}
            </button>

            {tier._expanded && (
              <div className="p-4 pt-0 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <Field
                    label="Tier Name"
                    value={tier.name}
                    onChange={(v) => updateTier(ti, "name", v)}
                  />
                  <Field
                    label="Tier Slug"
                    value={tier.slug}
                    onChange={(v) => updateTier(ti, "slug", v)}
                  />
                  <Field
                    label="Monthly Fee"
                    value={tier.monthly_fee.toString()}
                    onChange={(v) =>
                      updateTier(ti, "monthly_fee", parseFloat(v) || 0)
                    }
                    type="number"
                  />
                  <Field
                    label="Card Color (hex)"
                    value={tier.card_color}
                    onChange={(v) => updateTier(ti, "card_color", v)}
                    placeholder="#1a1a2e"
                  />
                  <Checkbox
                    label="Default Tier"
                    checked={tier.is_default}
                    onChange={(v) => updateTier(ti, "is_default", v)}
                  />
                  <Checkbox
                    label="Staking Required"
                    checked={tier.staking_required}
                    onChange={(v) => updateTier(ti, "staking_required", v)}
                  />
                </div>

                {/* Fees */}
                <h5 className="text-xs font-semibold uppercase tracking-wider text-zinc-500 pt-2">
                  Fees
                </h5>
                <div className="grid grid-cols-2 gap-3">
                  <Field
                    label="FX Markup %"
                    value={tier.fees.fx_markup_percent?.toString() || ""}
                    onChange={(v) =>
                      updateTierFees(
                        ti,
                        "fx_markup_percent",
                        v ? parseFloat(v) : null
                      )
                    }
                    type="number"
                  />
                  <Field
                    label="ATM Fee Domestic"
                    value={tier.fees.atm_fee_domestic?.toString() || ""}
                    onChange={(v) =>
                      updateTierFees(
                        ti,
                        "atm_fee_domestic",
                        v ? parseFloat(v) : null
                      )
                    }
                    type="number"
                  />
                  <Field
                    label="ATM Fee International"
                    value={tier.fees.atm_fee_international?.toString() || ""}
                    onChange={(v) =>
                      updateTierFees(
                        ti,
                        "atm_fee_international",
                        v ? parseFloat(v) : null
                      )
                    }
                    type="number"
                  />
                  <Field
                    label="Crypto Top-Up %"
                    value={tier.fees.topup_fee_crypto?.toString() || ""}
                    onChange={(v) =>
                      updateTierFees(
                        ti,
                        "topup_fee_crypto",
                        v ? parseFloat(v) : null
                      )
                    }
                    type="number"
                  />
                </div>
                <TextArea
                  label="Fee Notes"
                  value={tier.fees.fee_notes}
                  onChange={(v) => updateTierFees(ti, "fee_notes", v)}
                  rows={2}
                />

                {/* Rewards */}
                <h5 className="text-xs font-semibold uppercase tracking-wider text-zinc-500 pt-2">
                  Rewards
                </h5>
                <div className="grid grid-cols-2 gap-3">
                  <Field
                    label="Cashback %"
                    value={tier.rewards.cashback_percent?.toString() || ""}
                    onChange={(v) =>
                      updateTierRewards(
                        ti,
                        "cashback_percent",
                        v ? parseFloat(v) : null
                      )
                    }
                    type="number"
                  />
                  <Field
                    label="Cashback Currency"
                    value={tier.rewards.cashback_currency}
                    onChange={(v) =>
                      updateTierRewards(ti, "cashback_currency", v)
                    }
                  />
                  <Checkbox
                    label="Cashback in Token"
                    checked={tier.rewards.cashback_is_token}
                    onChange={(v) =>
                      updateTierRewards(ti, "cashback_is_token", v)
                    }
                  />
                  <Checkbox
                    label="Promotional"
                    checked={tier.rewards.is_promotional}
                    onChange={(v) =>
                      updateTierRewards(ti, "is_promotional", v)
                    }
                  />
                  <Checkbox
                    label="Subsidized"
                    checked={tier.rewards.is_subsidized}
                    onChange={(v) =>
                      updateTierRewards(ti, "is_subsidized", v)
                    }
                  />
                </div>
                <Field
                  label="Rewards Source"
                  value={tier.rewards.rewards_source}
                  onChange={(v) =>
                    updateTierRewards(ti, "rewards_source", v)
                  }
                />

                {/* Perks */}
                <h5 className="text-xs font-semibold uppercase tracking-wider text-zinc-500 pt-2">
                  Perks
                </h5>
                {tier.perks.map((perk, pi) => (
                  <div
                    key={pi}
                    className="grid grid-cols-2 gap-3 p-3 bg-white/5 rounded-lg relative"
                  >
                    <Select
                      label="Category"
                      value={perk.perk_category}
                      onChange={(v) =>
                        updatePerk(ti, pi, "perk_category", v)
                      }
                      options={[
                        { value: "insurance", label: "Insurance" },
                        { value: "lounge_access", label: "Lounge Access" },
                        { value: "subscriptions", label: "Subscriptions" },
                        { value: "yield", label: "Yield" },
                        { value: "defi_feature", label: "DeFi Feature" },
                        { value: "transfers", label: "Transfers" },
                        { value: "privacy", label: "Privacy" },
                        { value: "concierge", label: "Concierge" },
                        { value: "other", label: "Other" },
                      ]}
                    />
                    <Field
                      label="Name"
                      value={perk.perk_name}
                      onChange={(v) => updatePerk(ti, pi, "perk_name", v)}
                    />
                    <Field
                      label="Value"
                      value={perk.perk_value}
                      onChange={(v) =>
                        updatePerk(ti, pi, "perk_value", v)
                      }
                    />
                    <div className="flex items-end">
                      <button
                        type="button"
                        onClick={() => removePerk(ti, pi)}
                        className="p-2 rounded-lg text-danger hover:bg-danger/10"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => addPerk(ti)}
                  className="flex items-center gap-1 text-xs text-accent hover:text-accent-light"
                >
                  <Plus className="w-3 h-3" /> Add Perk
                </button>

                {/* Remove Tier */}
                {tiers.length > 1 && (
                  <button
                    type="button"
                    onClick={() =>
                      setTiers((prev) => prev.filter((_, i) => i !== ti))
                    }
                    className="flex items-center gap-1 text-xs text-danger hover:text-red-400 mt-2"
                  >
                    <Trash2 className="w-3 h-3" /> Remove Tier
                  </button>
                )}
              </div>
            )}
          </div>
        ))}
        <button
          type="button"
          onClick={() => setTiers((prev) => [...prev, emptyTier(prev.length)])}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-sm text-zinc-400 hover:text-white transition-colors"
        >
          <Plus className="w-4 h-4" /> Add Tier
        </button>
      </FormSection>

      {/* Submit */}
      <div className="flex gap-3 mt-8">
        <button
          type="submit"
          disabled={saving}
          className="flex items-center gap-2 px-6 py-3 rounded-xl bg-accent text-white font-semibold text-sm hover:bg-accent-light transition-colors disabled:opacity-50"
        >
          {saving ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Save className="w-4 h-4" />
          )}
          {saving ? "Saving..." : "Save Card"}
        </button>
        <button
          type="button"
          onClick={() => router.push("/admin")}
          className="px-6 py-3 rounded-xl bg-white/5 border border-white/10 text-zinc-400 text-sm font-medium hover:text-white transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

// Reusable form components
function FormSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mb-8">
      <h2 className="text-sm font-semibold text-zinc-300 mb-4 pb-2 border-b border-white/5">
        {title}
      </h2>
      {children}
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
  required,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  placeholder?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label className="block text-xs text-zinc-500 mb-1">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        step={type === "number" ? "any" : undefined}
        className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-accent"
      />
    </div>
  );
}

function TextArea({
  label,
  value,
  onChange,
  rows = 3,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  rows?: number;
}) {
  return (
    <div>
      <label className="block text-xs text-zinc-500 mb-1">{label}</label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={rows}
        className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-accent resize-y"
      />
    </div>
  );
}

function Select({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <div>
      <label className="block text-xs text-zinc-500 mb-1">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-accent"
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}

function Checkbox({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <label className="flex items-center gap-2 cursor-pointer">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="w-4 h-4 rounded border-white/20 bg-white/5 text-accent focus:ring-accent"
      />
      <span className="text-sm text-zinc-300">{label}</span>
    </label>
  );
}

"use client";

import { useState } from "react";
import type { CardWithDetails, TierWithDetails } from "@/lib/types";
import CardVisual from "./CardVisual";
import CardTypeBadge from "./CardTypeBadge";
import TierSelector from "./TierSelector";
import FeeTable from "./FeeTable";
import RewardsDisplay from "./RewardsDisplay";
import PerksList from "./PerksList";
import AssetGrid from "./AssetGrid";
import ChainBadge from "./ChainBadge";
import { useSavedCards } from "@/context/SavedCardsContext";
import {
  ExternalLink,
  Heart,
  HeartOff,
  Globe,
  Calendar,
  MapPin,
  Smartphone,
  X,
} from "lucide-react";

interface CardProfileProps {
  card: CardWithDetails;
  onClose?: () => void;
}

export default function CardProfile({ card, onClose }: CardProfileProps) {
  const defaultTier =
    card.tiers.find((t) => t.is_default) || card.tiers[0];
  const [selectedTierId, setSelectedTierId] = useState(
    defaultTier?.id || ""
  );

  const selectedTier: TierWithDetails | undefined = card.tiers.find(
    (t) => t.id === selectedTierId
  );

  const { saveCard, removeCard, isCardSaved } = useSavedCards();
  const saved = isCardSaved(card.id);

  function handleRefClick() {
    if (card.ref_link) {
      // Track via API route
      fetch(`/api/ref/${card.slug}`, { method: "POST" }).catch(() => {});
      window.open(card.ref_link, "_blank");
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Close button */}
      {onClose && (
        <button
          onClick={onClose}
          className="fixed top-4 right-4 z-50 w-10 h-10 rounded-full bg-card-bg border border-card-border flex items-center justify-center text-zinc-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      )}

      {/* Hero Section */}
      <div className="max-w-xs mx-auto mb-6">
        <CardVisual
          name={card.name}
          issuer={card.issuer}
          card_type={card.card_type}
          card_network={card.card_network}
          custody_model={card.custody_model}
          card_color={selectedTier?.card_color}
        />
      </div>

      <div className="text-center mb-6">
        <CardTypeBadge type={card.card_type} size="md" />
        <h1 className="text-2xl font-bold text-white mt-3">{card.name}</h1>
        <p className="text-sm text-zinc-400 mt-1">by {card.issuer}</p>
        {card.description && (
          <p className="text-sm text-zinc-300 mt-3 max-w-md mx-auto leading-relaxed">
            {card.description}
          </p>
        )}
      </div>

      {/* CTAs */}
      <div className="flex gap-3 mb-8 max-w-sm mx-auto">
        {card.ref_link && (
          <button
            onClick={handleRefClick}
            className="flex-1 flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-accent text-white font-semibold text-sm hover:bg-accent-light transition-colors"
          >
            <ExternalLink className="w-4 h-4" />
            Sign Up via blocmates
          </button>
        )}
        <button
          onClick={() =>
            saved ? removeCard(card.id) : saveCard(card.id)
          }
          className={`px-4 py-3 rounded-xl border text-sm font-medium transition-colors ${
            saved
              ? "bg-success/10 border-success/30 text-success"
              : "bg-white/5 border-white/10 text-zinc-400 hover:text-white"
          }`}
        >
          {saved ? (
            <HeartOff className="w-5 h-5" />
          ) : (
            <Heart className="w-5 h-5" />
          )}
        </button>
      </div>

      {/* Tier Selector */}
      <div className="mb-6">
        <TierSelector
          tiers={card.tiers}
          selectedTierId={selectedTierId}
          onSelect={setSelectedTierId}
        />
      </div>

      {/* Content Sections */}
      <div className="space-y-6">
        {/* Fees */}
        <Section title="Fees">
          <FeeTable fees={selectedTier?.fees || null} />
        </Section>

        {/* Rewards */}
        <Section title="Rewards">
          <RewardsDisplay rewards={selectedTier?.rewards || null} />
        </Section>

        {/* Perks */}
        <Section title="Perks & Benefits">
          <PerksList perks={selectedTier?.perks || []} />
        </Section>

        {/* Supported Assets */}
        {card.supported_assets.length > 0 && (
          <Section title="Supported Assets">
            <AssetGrid assets={card.supported_assets} />
          </Section>
        )}

        {/* Chain Support */}
        {card.supported_chains.length > 0 && (
          <Section title="Supported Chains">
            <div className="flex flex-wrap gap-2">
              {card.supported_chains.map((chain) => (
                <ChainBadge key={chain} chain={chain} />
              ))}
            </div>
          </Section>
        )}

        {/* About */}
        <Section title="About">
          <div className="space-y-3">
            {card.long_description && (
              <p className="text-sm text-zinc-300 leading-relaxed">
                {card.long_description}
              </p>
            )}
            <div className="grid grid-cols-2 gap-3">
              {card.year_launched && (
                <InfoItem
                  icon={<Calendar className="w-4 h-4" />}
                  label="Launched"
                  value={card.year_launched.toString()}
                />
              )}
              {card.supported_countries.length > 0 && (
                <InfoItem
                  icon={<MapPin className="w-4 h-4" />}
                  label="Countries"
                  value={`${card.supported_countries.length} supported`}
                />
              )}
              {card.website_url && (
                <InfoItem
                  icon={<Globe className="w-4 h-4" />}
                  label="Website"
                  value={
                    <a
                      href={card.website_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-accent hover:underline"
                    >
                      Visit
                    </a>
                  }
                />
              )}
              <InfoItem
                icon={<Smartphone className="w-4 h-4" />}
                label="Mobile Pay"
                value={[
                  card.apple_pay && "Apple Pay",
                  card.google_pay && "Google Pay",
                ]
                  .filter(Boolean)
                  .join(", ") || "Not available"}
              />
            </div>
          </div>
        </Section>
      </div>
    </div>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-card-bg border border-card-border rounded-2xl p-5">
      <h3 className="text-sm font-semibold text-white mb-4">{title}</h3>
      {children}
    </div>
  );
}

function InfoItem({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-2">
      <span className="text-zinc-500 mt-0.5">{icon}</span>
      <div>
        <p className="text-[10px] uppercase tracking-wider text-zinc-500">
          {label}
        </p>
        <p className="text-sm text-white">{value}</p>
      </div>
    </div>
  );
}

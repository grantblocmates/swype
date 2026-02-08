"use client";

import { useState, useRef, useEffect } from "react";
import { FunnelSimple, X, CaretDown } from "@phosphor-icons/react";

export interface FilterState {
  region: string | null;
  cardType: string | null;
  network: string | null;
  staking: string | null;
  sortBy: string;
}

export const DEFAULT_FILTERS: FilterState = {
  region: null,
  cardType: null,
  network: null,
  staking: null,
  sortBy: "recommended",
};

const REGION_OPTIONS = [
  { value: "US", label: "United States" },
  { value: "EU", label: "Europe" },
  { value: "UK", label: "United Kingdom" },
  { value: "OTHER", label: "Other" },
];

const CARD_TYPE_OPTIONS = [
  { value: "prepaid_debit", label: "Prepaid Debit" },
  { value: "pure_rewards", label: "Rewards" },
  { value: "collateralized_defi", label: "DeFi" },
  { value: "self_custody", label: "Self-Custody" },
];

const NETWORK_OPTIONS = [
  { value: "visa", label: "Visa" },
  { value: "mastercard", label: "Mastercard" },
  { value: "both", label: "Both" },
];

const STAKING_OPTIONS = [
  { value: "yes", label: "Staking Required" },
  { value: "no", label: "No Staking" },
];

const SORT_OPTIONS = [
  { value: "recommended", label: "Recommended" },
  { value: "cashback_high", label: "Highest Cashback" },
  { value: "fee_low", label: "Lowest Fee" },
  { value: "fx_low", label: "Lowest FX Fee" },
];

interface BrowseFiltersProps {
  filters: FilterState;
  onChange: (filters: FilterState) => void;
  resultCount: number;
}

export default function BrowseFilters({
  filters,
  onChange,
  resultCount,
}: BrowseFiltersProps) {
  const activeCount = [
    filters.region,
    filters.cardType,
    filters.network,
    filters.staking,
  ].filter(Boolean).length;

  function clearAll() {
    onChange(DEFAULT_FILTERS);
  }

  function updateFilter(key: keyof FilterState, value: string | null) {
    onChange({ ...filters, [key]: value });
  }

  return (
    <div className="space-y-3">
      {/* Filter pills row */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
        <div className="flex items-center text-muted mr-1 flex-shrink-0">
          <FunnelSimple className="w-4 h-4" weight="bold" />
        </div>

        <FilterPill
          label="Region"
          value={filters.region}
          options={REGION_OPTIONS}
          onSelect={(v) => updateFilter("region", v)}
        />
        <FilterPill
          label="Card Type"
          value={filters.cardType}
          options={CARD_TYPE_OPTIONS}
          onSelect={(v) => updateFilter("cardType", v)}
        />
        <FilterPill
          label="Network"
          value={filters.network}
          options={NETWORK_OPTIONS}
          onSelect={(v) => updateFilter("network", v)}
        />
        <FilterPill
          label="Staking"
          value={filters.staking}
          options={STAKING_OPTIONS}
          onSelect={(v) => updateFilter("staking", v)}
        />

        {/* Sort pill */}
        <div className="border-l border-border pl-2 flex-shrink-0">
          <FilterPill
            label="Sort"
            value={filters.sortBy === "recommended" ? null : filters.sortBy}
            options={SORT_OPTIONS}
            onSelect={(v) => updateFilter("sortBy", v || "recommended")}
            isSort
          />
        </div>
      </div>

      {/* Active filter summary */}
      <div className="flex items-center gap-2 text-sm text-muted font-body">
        <span className="font-medium">
          {resultCount} card{resultCount !== 1 ? "s" : ""}
        </span>
        {activeCount > 0 && (
          <>
            <span className="text-muted-light">&middot;</span>
            <button
              onClick={clearAll}
              className="text-primary hover:text-primary-hover font-medium transition-colors"
            >
              Clear filters
            </button>
          </>
        )}
      </div>
    </div>
  );
}

function FilterPill({
  label,
  value,
  options,
  onSelect,
  isSort = false,
}: {
  label: string;
  value: string | null;
  options: { value: string; label: string }[];
  onSelect: (value: string | null) => void;
  isSort?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) {
      document.addEventListener("mousedown", handleClick);
      return () => document.removeEventListener("mousedown", handleClick);
    }
  }, [open]);

  const activeOption = options.find((o) => o.value === value);
  const isActive = value !== null;

  return (
    <div className="relative flex-shrink-0" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-body font-medium border transition-all duration-200 ${
          isActive
            ? "bg-accent-yellow border-accent-yellow text-dark font-semibold"
            : "bg-surface border-border text-dark hover:border-primary/40"
        }`}
      >
        {activeOption ? activeOption.label : label}
        {isActive && !isSort ? (
          <X
            className="w-3.5 h-3.5 ml-0.5"
            weight="bold"
            onClick={(e) => {
              e.stopPropagation();
              onSelect(null);
              setOpen(false);
            }}
          />
        ) : (
          <CaretDown
            className={`w-3.5 h-3.5 text-muted transition-transform ${open ? "rotate-180" : ""}`}
            weight="bold"
          />
        )}
      </button>

      {open && (
        <div className="absolute top-full left-0 mt-1.5 min-w-[180px] bg-surface border border-border rounded-xl shadow-card-hover py-1.5 z-50">
          {!isSort && isActive && (
            <button
              onClick={() => {
                onSelect(null);
                setOpen(false);
              }}
              className="w-full text-left px-4 py-2.5 text-sm font-body text-muted hover:bg-subtle transition-colors"
            >
              All {label}s
            </button>
          )}
          {options.map((opt) => (
            <button
              key={opt.value}
              onClick={() => {
                onSelect(opt.value);
                setOpen(false);
              }}
              className={`w-full text-left px-4 py-2.5 text-sm font-body transition-colors ${
                value === opt.value
                  ? "text-primary font-semibold bg-primary/5"
                  : "text-dark hover:bg-subtle"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

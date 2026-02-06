import type { Fee } from "@/lib/types";

interface FeeTableProps {
  fees: Fee | null;
}

function FeeRow({
  label,
  value,
  highlight,
}: {
  label: string;
  value: string | null;
  highlight?: boolean;
}) {
  if (!value) return null;
  return (
    <div className="flex items-center justify-between py-2.5 border-b border-card-border last:border-0">
      <span className="text-sm text-muted">{label}</span>
      <span
        className={`text-sm font-medium ${
          highlight ? "text-accent" : "text-foreground"
        }`}
      >
        {value}
      </span>
    </div>
  );
}

function formatPercent(val: number | null | undefined): string | null {
  if (val == null) return null;
  return `${val}%`;
}

function formatCurrency(val: number | null | undefined): string | null {
  if (val == null) return null;
  if (val === 0) return "Free";
  return `$${val.toFixed(2)}`;
}

export default function FeeTable({ fees }: FeeTableProps) {
  if (!fees) {
    return (
      <p className="text-sm text-muted italic">
        No fee information available.
      </p>
    );
  }

  return (
    <div className="space-y-1">
      <h4 className="text-xs font-semibold uppercase tracking-wider text-muted mb-3">
        Foreign Exchange
      </h4>
      <FeeRow
        label="FX Markup"
        value={formatPercent(fees.fx_markup_percent)}
        highlight={fees.fx_markup_percent === 0}
      />
      <FeeRow
        label="Free FX Monthly Limit"
        value={formatCurrency(fees.fx_free_limit_monthly)}
      />
      <FeeRow
        label="Weekend Surcharge"
        value={formatPercent(fees.weekend_fx_surcharge)}
      />

      <h4 className="text-xs font-semibold uppercase tracking-wider text-muted mb-3 mt-4">
        ATM Withdrawals
      </h4>
      <FeeRow
        label="Domestic ATM Fee"
        value={formatCurrency(fees.atm_fee_domestic)}
        highlight={fees.atm_fee_domestic === 0}
      />
      <FeeRow
        label="International ATM Fee"
        value={formatCurrency(fees.atm_fee_international)}
      />
      <FeeRow
        label="ATM Fee %"
        value={formatPercent(fees.atm_fee_percent)}
      />
      <FeeRow
        label="Free ATM Monthly Limit"
        value={formatCurrency(fees.atm_free_limit_monthly)}
      />

      <h4 className="text-xs font-semibold uppercase tracking-wider text-muted mb-3 mt-4">
        Top-Up Fees
      </h4>
      <FeeRow
        label="Crypto Top-Up"
        value={formatPercent(fees.topup_fee_crypto)}
        highlight={fees.topup_fee_crypto === 0}
      />
      <FeeRow
        label="Bank Transfer"
        value={formatPercent(fees.topup_fee_bank)}
        highlight={fees.topup_fee_bank === 0}
      />
      <FeeRow
        label="Card Top-Up"
        value={formatPercent(fees.topup_fee_card)}
      />

      {(fees.borrow_interest_rate != null ||
        fees.liquidation_threshold != null) && (
        <>
          <h4 className="text-xs font-semibold uppercase tracking-wider text-muted mb-3 mt-4">
            DeFi / Borrowing
          </h4>
          <FeeRow
            label="Borrow Interest Rate"
            value={formatPercent(fees.borrow_interest_rate)}
          />
          <FeeRow
            label="Liquidation Threshold"
            value={formatPercent(fees.liquidation_threshold)}
          />
          <FeeRow
            label="Min Collateral Ratio"
            value={formatPercent(fees.min_collateral_ratio)}
          />
        </>
      )}

      {(fees.inactivity_fee != null || fees.card_replacement_fee != null) && (
        <>
          <h4 className="text-xs font-semibold uppercase tracking-wider text-muted mb-3 mt-4">
            Other Fees
          </h4>
          <FeeRow
            label="Inactivity Fee"
            value={formatCurrency(fees.inactivity_fee)}
          />
          <FeeRow
            label="Card Replacement"
            value={formatCurrency(fees.card_replacement_fee)}
          />
        </>
      )}

      {fees.fee_notes && (
        <p className="text-xs text-muted mt-3 italic">{fees.fee_notes}</p>
      )}
    </div>
  );
}

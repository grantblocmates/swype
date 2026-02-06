const chainConfig: Record<string, { label: string; color: string }> = {
  ethereum: { label: "ETH", color: "bg-blue-50 text-blue-700 border-blue-200" },
  scroll: { label: "Scroll", color: "bg-amber-50 text-amber-700 border-amber-200" },
  base: { label: "Base", color: "bg-blue-50 text-blue-700 border-blue-200" },
  solana: { label: "SOL", color: "bg-purple-50 text-purple-700 border-purple-200" },
  polygon: { label: "MATIC", color: "bg-violet-50 text-violet-700 border-violet-200" },
  arbitrum: { label: "ARB", color: "bg-sky-50 text-sky-700 border-sky-200" },
  optimism: { label: "OP", color: "bg-red-50 text-red-700 border-red-200" },
  avalanche: { label: "AVAX", color: "bg-rose-50 text-rose-700 border-rose-200" },
  bnb: { label: "BNB", color: "bg-yellow-50 text-yellow-700 border-yellow-200" },
};

export default function ChainBadge({ chain }: { chain: string }) {
  const config = chainConfig[chain.toLowerCase()] || {
    label: chain,
    color: "bg-stone-100 text-stone-600 border-stone-200",
  };

  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium border ${config.color}`}
    >
      {config.label}
    </span>
  );
}

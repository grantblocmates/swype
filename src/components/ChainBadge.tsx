const chainConfig: Record<string, { label: string; color: string }> = {
  ethereum: { label: "ETH", color: "bg-blue-500/20 text-blue-300" },
  scroll: { label: "Scroll", color: "bg-amber-500/20 text-amber-300" },
  base: { label: "Base", color: "bg-blue-600/20 text-blue-300" },
  solana: { label: "SOL", color: "bg-purple-500/20 text-purple-300" },
  polygon: { label: "MATIC", color: "bg-violet-500/20 text-violet-300" },
  arbitrum: { label: "ARB", color: "bg-sky-500/20 text-sky-300" },
  optimism: { label: "OP", color: "bg-red-500/20 text-red-300" },
  avalanche: { label: "AVAX", color: "bg-rose-500/20 text-rose-300" },
  bnb: { label: "BNB", color: "bg-yellow-500/20 text-yellow-300" },
};

export default function ChainBadge({ chain }: { chain: string }) {
  const config = chainConfig[chain.toLowerCase()] || {
    label: chain,
    color: "bg-zinc-500/20 text-zinc-300",
  };

  return (
    <span
      className={`inline-flex items-center rounded px-1.5 py-0.5 text-[10px] font-medium ${config.color}`}
    >
      {config.label}
    </span>
  );
}

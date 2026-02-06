"use client";

import { useRouter } from "next/navigation";
import type { CardWithDetails } from "@/lib/types";
import Header from "@/components/Header";
import CardProfile from "@/components/CardProfile";

interface CardDetailClientProps {
  card: CardWithDetails;
}

export default function CardDetailClient({ card }: CardDetailClientProps) {
  const router = useRouter();

  return (
    <div className="min-h-screen">
      <Header />
      <main className="max-w-2xl mx-auto px-4 py-10">
        <CardProfile card={card} onClose={() => router.back()} />
      </main>
    </div>
  );
}

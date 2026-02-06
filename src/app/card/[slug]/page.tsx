import { getCardBySlug } from "@/lib/queries";
import CardDetailClient from "./CardDetailClient";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

interface Props {
  params: { slug: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const card = await getCardBySlug(params.slug);
  if (!card) return { title: "Card Not Found" };

  return {
    title: `${card.name} - Swype by blocmates`,
    description:
      card.description ||
      `Compare ${card.name} fees, rewards, and perks on Swype.`,
  };
}

export default async function CardDetailPage({ params }: Props) {
  const card = await getCardBySlug(params.slug);

  if (!card) {
    notFound();
  }

  return <CardDetailClient card={card} />;
}

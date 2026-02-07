import { getAllTierCards } from "@/lib/queries";
import BrowseClient from "./BrowseClient";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Browse All Cards - Swype | blocmates",
  description:
    "Swipe through all crypto and DeFi cards. Save your favorites and compare them side by side.",
};

export default async function BrowsePage() {
  const cards = await getAllTierCards();

  return <BrowseClient cards={cards} />;
}

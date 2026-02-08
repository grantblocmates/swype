import { Suspense } from "react";
import { getAllTierCards } from "@/lib/queries";
import BrowseClient from "./BrowseClient";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Browse All Cards - Swype | blocmates",
  description:
    "Browse and filter all crypto and DeFi cards. Compare features, fees, and rewards side by side.",
};

export default async function BrowsePage() {
  const cards = await getAllTierCards();

  return (
    <Suspense>
      <BrowseClient cards={cards} />
    </Suspense>
  );
}

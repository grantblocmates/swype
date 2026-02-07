import { getAllTierCards } from "@/lib/queries";
import ResultsClient from "./ResultsClient";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Your Results - Swype | blocmates",
  description: "Personalized crypto card recommendations based on your preferences.",
};

export default async function ResultsPage() {
  const cards = await getAllTierCards();

  return <ResultsClient cards={cards} />;
}

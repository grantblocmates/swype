import { getAllCards } from "@/lib/queries";
import HomeClient from "./HomeClient";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const cards = await getAllCards();

  return <HomeClient cards={cards} />;
}

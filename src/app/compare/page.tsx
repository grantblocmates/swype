import CompareClient from "./CompareClient";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Compare Cards - CardStack by blocmates",
  description: "Compare your saved crypto cards side by side.",
};

export default function ComparePage() {
  return <CompareClient />;
}

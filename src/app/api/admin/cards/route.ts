import { NextRequest, NextResponse } from "next/server";
import { adminGetAllCards, adminUpsertCard } from "@/lib/queries";

export async function GET() {
  try {
    const cards = await adminGetAllCards();
    return NextResponse.json(cards);
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch cards" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const card = await adminUpsertCard(body);
    return NextResponse.json(card);
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Failed to save card" },
      { status: 500 }
    );
  }
}

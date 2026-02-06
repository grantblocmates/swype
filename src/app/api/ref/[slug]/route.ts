import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  const { slug } = params;

  try {
    // Find the card by slug
    const { data: card } = await supabase
      .from("cards")
      .select("id, ref_link")
      .eq("slug", slug)
      .single();

    if (!card) {
      return NextResponse.json({ error: "Card not found" }, { status: 404 });
    }

    // Log the click
    const body = await request.json().catch(() => ({}));
    await supabase.from("ref_clicks").insert({
      card_id: card.id,
      source: body.source || "unknown",
    });

    return NextResponse.json({ ref_link: card.ref_link });
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// GET redirects directly to the ref link
export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  const { slug } = params;

  const { data: card } = await supabase
    .from("cards")
    .select("id, ref_link")
    .eq("slug", slug)
    .single();

  if (!card?.ref_link) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // Log the click
  await supabase.from("ref_clicks").insert({
    card_id: card.id,
    source: "direct",
  });

  return NextResponse.redirect(card.ref_link);
}

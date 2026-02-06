import { NextRequest, NextResponse } from "next/server";
import { adminDeleteCard } from "@/lib/queries";
import { getServiceClient } from "@/lib/supabase";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const client = getServiceClient();
    const { data, error } = await client
      .from("cards")
      .select(
        `
        *,
        tiers (
          *,
          fees (*),
          rewards (*),
          perks (*)
        ),
        supported_assets (*)
      `
      )
      .eq("id", params.id)
      .single();

    if (error) throw error;

    // Normalize tiers data
    if (data?.tiers) {
      data.tiers = data.tiers
        .sort((a: any, b: any) => a.tier_order - b.tier_order)
        .map((tier: any) => ({
          ...tier,
          fees: tier.fees?.[0] || null,
          rewards: tier.rewards?.[0] || null,
          perks: (tier.perks || []).sort(
            (a: any, b: any) => a.display_order - b.display_order
          ),
        }));
    }

    return NextResponse.json(data);
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Failed to fetch card" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await adminDeleteCard(params.id);
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Failed to delete card" },
      { status: 500 }
    );
  }
}

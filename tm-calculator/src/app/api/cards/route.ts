import { NextRequest, NextResponse } from "next/server";
import { getAllCards, searchCards, getCardsByType, getCardsByTag } from "@/lib/db";
import { CardType } from "@/lib/types";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get("q");
  const type = searchParams.get("type") as CardType | null;
  const tag = searchParams.get("tag");

  try {
    let cards;
    if (query) {
      cards = searchCards(query);
    } else if (type) {
      cards = getCardsByType(type);
    } else if (tag) {
      cards = getCardsByTag(tag);
    } else {
      cards = getAllCards();
    }

    return NextResponse.json(cards);
  } catch (error) {
    console.error("Error fetching cards:", error);
    return NextResponse.json({ error: "Failed to fetch cards" }, { status: 500 });
  }
}

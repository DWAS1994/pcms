import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const playerId = Number(id);

  if (Number.isNaN(playerId)) {
    return NextResponse.json(
      { error: "Invalid player id" },
      { status: 400 }
    );
  }

  const player = await prisma.player.findUnique({
    where: {
      id: playerId,
    },
  });

  if (!player) {
    return NextResponse.json(
      { error: "Player not found" },
      { status: 404 }
    );
  }

  return NextResponse.json({
    player: {
      ...player,
      gold: player.gold.toString(),
    },
  });
}

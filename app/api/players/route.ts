import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";

const schema = z.object({
  accountName: z.string().min(1),
  characterName: z.string().min(1),
  level: z.number().int().min(1).default(1),
  gold: z.union([z.string(), z.number()]).default("0"),
  ipAddress: z.string().optional().nullable(),
  status: z.string().default("active"),
  notes: z.string().optional().nullable()
});

export async function GET(req: Request) {
  const user = await requireAuth(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const players = await prisma.player.findMany({
    orderBy: { updatedAt: "desc" }
  });

  return NextResponse.json({ players });
}

export async function POST(req: Request) {
  const user = await requireAuth(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const json = await req.json().catch(() => null);
  const parsed = schema.safeParse(json);

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid player payload" }, { status: 400 });
  }

  const p = parsed.data;

  const player = await prisma.player.create({
    data: {
      accountName: p.accountName,
      characterName: p.characterName,
      level: p.level,
      gold: BigInt(p.gold),
      ipAddress: p.ipAddress || null,
      status: p.status,
      notes: p.notes || null
    }
  });

  await prisma.auditLog.create({
    data: {
      actor: user.username,
      action: "create",
      entity: "player",
      entityId: String(player.id),
      metadata: { accountName: player.accountName }
    }
  });

  return NextResponse.json({ player });
}

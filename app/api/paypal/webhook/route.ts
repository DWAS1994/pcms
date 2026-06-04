import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);

  if (!body) {
    return NextResponse.json({ error: "Invalid webhook body" }, { status: 400 });
  }

  await prisma.auditLog.create({
    data: {
      actor: "paypal",
      action: String(body.event_type || "webhook"),
      entity: "paypal",
      entityId: String(body.id || ""),
      metadata: body
    }
  });

  return NextResponse.json({ received: true });
}

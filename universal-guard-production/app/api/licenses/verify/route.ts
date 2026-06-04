import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const schema = z.object({
  licenseKey: z.string().min(1)
});

export async function POST(req: Request) {
  const json = await req.json().catch(() => null);
  const parsed = schema.safeParse(json);

  if (!parsed.success) {
    return NextResponse.json({ valid: false, error: "Invalid payload" }, { status: 400 });
  }

  const license = await prisma.license.findUnique({
    where: { licenseKey: parsed.data.licenseKey }
  });

  if (!license) {
    return NextResponse.json({ valid: false, reason: "not_found" });
  }

  if (license.status !== "active") {
    return NextResponse.json({ valid: false, reason: "inactive" });
  }

  if (license.expiresAt && license.expiresAt < new Date()) {
    return NextResponse.json({ valid: false, reason: "expired" });
  }

  return NextResponse.json({
    valid: true,
    license: {
      productId: license.productId,
      ownerEmail: license.ownerEmail,
      expiresAt: license.expiresAt
    }
  });
}

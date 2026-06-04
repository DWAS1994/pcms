import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { capturePayPalOrder } from "@/lib/paypal";
import { generateLicenseKey, getLicenseExpiry } from "@/lib/license";

const schema = z.object({
  orderId: z.string().min(1),
  email: z.string().email()
});

export async function POST(req: Request) {
  const json = await req.json().catch(() => null);
  const parsed = schema.safeParse(json);

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid capture payload" }, { status: 400 });
  }

  const { orderId, email } = parsed.data;

  try {
    const capture = await capturePayPalOrder(orderId);

    const status = String(capture.status || "");

    if (status !== "COMPLETED") {
      return NextResponse.json({ error: "Payment not completed", status }, { status: 400 });
    }

    const payerId = capture.payer?.payer_id || null;

    const existing = await prisma.license.findUnique({
      where: { orderId }
    });

    if (existing) {
      return NextResponse.json({ license: existing });
    }

    const license = await prisma.license.create({
      data: {
        productId: process.env.LICENSE_PRODUCT_ID || "UG-PROD-001",
        licenseKey: generateLicenseKey(),
        ownerEmail: email,
        status: "active",
        activatedAt: new Date(),
        expiresAt: getLicenseExpiry(),
        orderId,
        payerId
      }
    });

    await prisma.auditLog.create({
      data: {
        actor: email,
        action: "paypal_capture",
        entity: "license",
        entityId: String(license.id),
        metadata: { orderId, payerId }
      }
    });

    return NextResponse.json({ license });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Could not capture payment" },
      { status: 500 }
    );
  }
}

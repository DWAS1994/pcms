import { NextResponse } from "next/server";
import { z } from "zod";
import { createPayPalOrder } from "@/lib/paypal";

const schema = z.object({
  email: z.string().email()
});

export async function POST(req: Request) {
  const json = await req.json().catch(() => null);
  const parsed = schema.safeParse(json);

  if (!parsed.success) {
    return NextResponse.json({ error: "Valid email is required" }, { status: 400 });
  }

  try {
    const order = await createPayPalOrder();
    return NextResponse.json(order);
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Could not create order" },
      { status: 500 }
    );
  }
}

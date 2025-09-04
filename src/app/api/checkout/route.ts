import { NextResponse } from "next/server";
import { createCheckoutSession } from "@/lib/paymongo";
import { type CheckoutParams } from "paymongo-fn";
import { debugResponse } from "@/lib/debug/response";

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as CheckoutParams;

    const result = await createCheckoutSession(body);

    console.log("[BODY]:", body);
    console.log("[RESULT]:", result);

    if (!result) {
      return NextResponse.json(
        { error: { message: "Failed to create checkout: empty response" } },
        { status: 502 },
      );
    }

    // createCheckoutSession already unwraps to PayMongo's payload.data (resource)
    return NextResponse.json(result, { status: 201 });
  } catch (error: unknown) {
    // Derive appropriate HTTP status
    const status = 500;

    // Build a JSON-safe error payload (only in Dev environment)
    const debug = debugResponse(error, status);

    if (debug) {
      const { error, status } = debug;
      return NextResponse.json({ error }, { status });
    }
    console.error("[CHECKOUT_ERROR]:", error);

    return NextResponse.json({ error }, { status });
  }
}

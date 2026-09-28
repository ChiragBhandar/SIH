import { NextRequest, NextResponse } from "next/server";
import { buildPublicVerification, findBottle, normalizeBottleId } from "@/data/mock-bottles";

/**
 * GET /api/verify/[bottleId]
 *
 * Public endpoint — no authentication required.
 * Returns consumer-safe traceability data for a given bottle.
 *
 * Security:
 * - Only returns data explicitly marked for consumer visibility via buildPublicVerification()
 * - Never exposes internal IDs, admin data, passwords, or operational metadata
 * - The bottleId is a non-sensitive public identifier printed on product labels
 */
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ bottleId: string }> }
) {
  const { bottleId } = await params;

  // Normalize bottle code (supports shorthand numbers, case-insensitivity, URL pastes)
  const safeId = normalizeBottleId(bottleId || "");

  if (!safeId || safeId.length < 1) {
    return NextResponse.json(
      {
        error: "invalid_token",
        message: "Invalid or malformed product identifier.",
        verificationStatus: "UNKNOWN",
      },
      { status: 400 }
    );
  }

  // Find bottle in static registry or official packaging runs
  const bottle = findBottle(safeId);

  if (!bottle) {
    // Return a clean 404 — no database errors, no stack traces exposed
    return NextResponse.json(
      {
        error: "not_found",
        message: "No verified product record found for this identifier.",
        verificationStatus: "UNKNOWN",
        bottleId: safeId,
      },
      { status: 404 }
    );
  }

  // Build sanitized consumer-safe verification payload
  // buildPublicVerification strips all sensitive data (internal IDs, user emails,
  // admin controls, organization settings, processing operational metadata)
  const publicData = buildPublicVerification(bottle);

  return NextResponse.json(publicData, {
    status: 200,
    headers: {
      // Allow public caching for 60 seconds — fast loads for consumers scanning QR
      "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
      "X-Content-Type-Options": "nosniff",
    },
  });
}

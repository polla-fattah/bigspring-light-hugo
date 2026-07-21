import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    portal: "Salahaddin University-Erbil Research Center Headless API",
    version: "1.0.0",
    endpoints: {
      search: "/api/search?q={query}&type={all|staff|projects|publications|labs|equipment|events|datasets}&unitId={unit_id}"
    }
  });
}

import { NextResponse } from "next/server";
import { getSiteContent } from "@/lib/data";

export const revalidate = 60;

export async function GET() {
  try {
    const content = await getSiteContent();
    return NextResponse.json({
      success: true,
      social: content.social,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/util/supabase/server";
import { scrapeAndUpdateResources } from "@/lib/scraper";

export async function POST(req: NextRequest) {
  try {
    // Check authentication and admin status
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if user is admin
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("is_admin")
      .eq("id", user.id)
      .single();

    if (profileError || !profile?.is_admin) {
      return NextResponse.json({ error: "Forbidden: Admin access required" }, { status: 403 });
    }

    // Get optional slug from request body
    const body = await req.json().catch(() => ({}));
    const slug = body.slug || null;

    // Run scraping
    const result = await scrapeAndUpdateResources(slug || undefined);

    if (!result.ok) {
      return NextResponse.json({ error: result.error }, { status: 500 });
    }

    return NextResponse.json({
      ok: true,
      total: result.total,
      okCount: result.okCount,
      failCount: result.failCount,
      message: slug
        ? `Scraping completed for resource: ${slug}`
        : `Scraping completed: ${result.okCount} succeeded, ${result.failCount} failed out of ${result.total} resources`,
    });
  } catch (e: any) {
    console.error("Error in scrape-meta API:", e);
    return NextResponse.json({ error: e?.message || "Internal server error" }, { status: 500 });
  }
}


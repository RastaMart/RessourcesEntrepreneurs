import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/util/supabase/server";

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

    // Get slug and imageUrl from request body
    const body = await req.json();
    const { slug, imageUrl } = body;

    if (!slug || !imageUrl) {
      return NextResponse.json({ error: "slug and imageUrl are required" }, { status: 400 });
    }

    // Verify resource exists
    const { data: resource, error: resourceError } = await supabase
      .from("resources")
      .select("slug, site")
      .eq("slug", slug)
      .single();

    if (resourceError || !resource) {
      return NextResponse.json({ error: "Resource not found" }, { status: 404 });
    }

    // Download the image
    let imageResponse;
    try {
      imageResponse = await fetch(imageUrl, {
        redirect: "follow",
        headers: {
          "user-agent": "Mozilla/5.0 (compatible; RessourcesEntrepreneursBot/1.0; +https://example.com)",
        },
      });

      if (!imageResponse.ok) {
        console.error("Failed to download image:", {
          status: imageResponse.status,
          statusText: imageResponse.statusText,
          url: imageUrl,
        });
        return NextResponse.json({ 
          error: "Failed to download image",
          details: `HTTP ${imageResponse.status}: ${imageResponse.statusText}`
        }, { status: 500 });
      }
    } catch (fetchError: any) {
      console.error("Error fetching image:", fetchError);
      return NextResponse.json({ 
        error: "Failed to download image",
        details: fetchError?.message || "Network error"
      }, { status: 500 });
    }

    const arrayBuffer = await imageResponse.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Determine file extension and content type
    const contentType = imageResponse.headers.get("content-type") || "";
    let ext = "jpg";
    if (contentType.includes("png")) ext = "png";
    else if (contentType.includes("webp")) ext = "webp";
    else if (contentType.includes("gif")) ext = "gif";
    else if (contentType.includes("svg")) ext = "svg";
    else if (contentType.includes("jpeg") || contentType.includes("jpg")) ext = "jpg";

    // Try to get extension from URL if not in content-type
    if (ext === "jpg") {
      try {
        const urlObj = new URL(imageUrl);
        const pathname = urlObj.pathname.toLowerCase();
        if (pathname.endsWith(".png")) ext = "png";
        else if (pathname.endsWith(".webp")) ext = "webp";
        else if (pathname.endsWith(".gif")) ext = "gif";
        else if (pathname.endsWith(".svg")) ext = "svg";
        else if (pathname.endsWith(".jpeg") || pathname.endsWith(".jpg")) ext = "jpg";
      } catch {
        // Use default
      }
    }

    const filename = `${slug}.${ext}`;

    const contentTypeMap: Record<string, string> = {
      jpg: "image/jpeg",
      jpeg: "image/jpeg",
      png: "image/png",
      gif: "image/gif",
      webp: "image/webp",
      svg: "image/svg+xml",
    };

    const finalContentType = contentTypeMap[ext] || "image/jpeg";

    // Upload to Supabase Storage
    // First try to remove existing file if it exists (to avoid RLS issues with upsert)
    await supabase.storage
      .from("resources")
      .remove([filename])
      .catch(() => {
        // Ignore errors if file doesn't exist
      });
    
    // Then upload the new file
    const { error: uploadError, data: uploadData } = await supabase.storage
      .from("resources")
      .upload(filename, buffer, {
        contentType: finalContentType,
        upsert: false, // Use insert instead of upsert to avoid RLS issues
      });

    if (uploadError) {
      console.error("Error uploading image:", {
        message: uploadError.message,
        name: uploadError.name,
        filename,
        contentType: finalContentType,
        bufferSize: buffer.length,
      });
      return NextResponse.json({ 
        error: "Failed to upload image",
        details: uploadError.message 
      }, { status: 500 });
    }

    // Get public URL
    const { data: publicUrlData } = supabase.storage
      .from("resources")
      .getPublicUrl(filename);

    // Update database
    const { error: updateError } = await supabase
      .from("resources")
      .update({ image_url: publicUrlData.publicUrl })
      .eq("slug", slug);

    if (updateError) {
      console.error("Error updating resource:", updateError);
      return NextResponse.json({ error: "Failed to update resource" }, { status: 500 });
    }

    return NextResponse.json({
      ok: true,
      imageUrl: publicUrlData.publicUrl,
      message: "Image updated successfully",
    });
  } catch (e: any) {
    console.error("Error in update-resource-image API:", e);
    return NextResponse.json({ error: e?.message || "Internal server error" }, { status: 500 });
  }
}


"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import SocialIcon from "./SocialIcon";
import { createClient } from "../util/supabase/client";
import type { User } from "@supabase/supabase-js";
import { getCategoryForResourceType } from "../lib/resourceTypeMapper";
import { resourceTypes } from "../lib/resourceTypes";

type Resource = {
  slug: string;
  nom: string;
  type: string;
  types: string[];
  typeOrganisation: string;
  localisation: string;
  geographie: string;
  geographie2: string;
  site: string;
  secteur: string;
  modalite: string;
  services: string;
  publicCible: string;
  contacts: string;
  autres: string;
  supports: string[];
  metaDescription: string | null;
  metaImage: string | null;
  socials: Array<{ platform: string; url: string }>;
};

type Props = {
  resource: Resource;
  isAdmin: boolean;
};

type EditableField = {
  key: keyof Resource;
  label: string;
  value: string;
  section: "main" | "sidebar";
};

function EditableField({
  field,
  value,
  isEditing,
  onSave,
  placeholder,
}: {
  field: string;
  value: string;
  isEditing: boolean;
  onSave: (value: string) => Promise<void>;
  placeholder?: string;
}) {
  const [localValue, setLocalValue] = useState(value);
  const [isHovered, setIsHovered] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [savedHeight, setSavedHeight] = useState<number | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const measureRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  useEffect(() => {
    if (isEditing && isHovered && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [isEditing, isHovered]);

  useEffect(() => {
    if (textareaRef.current && measureRef.current) {
      // Measure the text
      measureRef.current.textContent = localValue || "\u00A0";
      const scrollHeight = measureRef.current.scrollHeight;
      
      // Set height on textarea
      textareaRef.current.style.height = "auto";
      const newHeight = Math.max(scrollHeight, 24);
      textareaRef.current.style.height = `${newHeight}px`;
      
      // Save height for loading state
      setSavedHeight(newHeight);
    }
  }, [localValue, isEditing]);

  useEffect(() => {
    // Initialize saved height when value changes from outside
    if (measureRef.current && !isEditing) {
      measureRef.current.textContent = value || "\u00A0";
      setSavedHeight(measureRef.current.scrollHeight || 24);
    }
  }, [value, isEditing]);

  const handleBlur = async () => {
    if (localValue !== value) {
      setIsSaving(true);
      try {
        await onSave(localValue);
      } catch (error) {
        console.error("Error saving field:", error);
        // Error is already handled in onSave, but we need to reset saving state
      } finally {
        setIsSaving(false);
      }
    } else {
      setIsHovered(false);
    }
  };

  // Ensure consistent value for hydration
  const displayValue = (value || (placeholder && !isEditing ? placeholder : "")).trim();

  if (isSaving) {
    return (
      <div
        ref={containerRef}
        style={{
          minHeight: savedHeight ? `${savedHeight}px` : "1.5em",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#6b7280",
          fontSize: "0.9rem",
          width: "100%",
        }}
      >
        <span style={{ fontSize: "0.85rem" }}>Enregistrement…</span>
      </div>
    );
  }

  if (!isEditing) {
    // For contacts field, render HTML to support line breaks
    if (field === "contacts") {
      if (displayValue) {
        // Use suppressHydrationWarning to avoid hydration mismatch warnings
        // The HTML content may differ slightly between server and client rendering
        return (
          <span
            key={`contacts-${value?.substring(0, 50) || ''}`}
            style={{ color: !value && placeholder ? "#9ca3af" : "inherit" }}
            dangerouslySetInnerHTML={{ __html: displayValue }}
            suppressHydrationWarning
          />
        );
      }
      return <span style={{ color: !value && placeholder ? "#9ca3af" : "inherit" }}>{"\u00A0"}</span>;
    }
    return <span style={{ color: !value && placeholder ? "#9ca3af" : "inherit" }}>{displayValue || "\u00A0"}</span>;
  }

  return (
    <div
      ref={containerRef}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => !textareaRef.current?.matches(":focus") && setIsHovered(false)}
      style={{ position: "relative", width: "100%" }}
    >
      <div
        ref={measureRef}
        style={{
          position: "absolute",
          opacity: 0,
          pointerEvents: "none",
          whiteSpace: "pre-wrap",
          wordWrap: "break-word",
          fontSize: "inherit",
          fontFamily: "inherit",
          lineHeight: "inherit",
          width: "100%",
          padding: "0.25rem 0.5rem",
          boxSizing: "border-box",
        }}
      />
      <textarea
        ref={textareaRef}
        value={localValue}
        onChange={(e) => setLocalValue(e.target.value)}
        onBlur={handleBlur}
        placeholder={placeholder}
        style={{
          width: "100%",
          minHeight: "1.5em",
          resize: "none",
          overflow: "hidden",
          border: isHovered ? "1px solid #3b82f6" : "1px solid transparent",
          borderRadius: "4px",
          padding: isHovered ? "0.25rem 0.5rem" : "0",
          margin: isHovered ? "-0.25rem -0.5rem" : "0",
          background: isHovered ? "#f9fafb" : "transparent",
          fontSize: "inherit",
          fontFamily: "inherit",
          lineHeight: "inherit",
          outline: "none",
          boxSizing: "border-box",
          color: localValue ? "inherit" : "#9ca3af",
        }}
        rows={1}
      />
    </div>
  );
}

const SOCIAL_PLATFORMS = [
  { key: "linkedin", label: "LinkedIn" },
  { key: "instagram", label: "Instagram" },
  { key: "facebook", label: "Facebook" },
  { key: "twitter", label: "Twitter/X" },
  { key: "youtube", label: "YouTube" },
  { key: "tiktok", label: "TikTok" },
] as const;

export default function ResourceDetailClient({ resource: initialResource, isAdmin }: Props) {
  const [resource, setResource] = useState(initialResource);
  const [isEditMode, setIsEditMode] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isScraping, setIsScraping] = useState(false);
  const [scrapeMessage, setScrapeMessage] = useState<string | null>(null);
  const [showImageModal, setShowImageModal] = useState(false);
  const [isLoadingImages, setIsLoadingImages] = useState(false);
  const [scrapedImages, setScrapedImages] = useState<Array<{ url: string; source: string; score: number }>>([]);
  const [isUpdatingImage, setIsUpdatingImage] = useState(false);
  const [supabase] = useState(() => createClient());
  const router = useRouter();

  const getDbFieldName = (field: keyof Resource): string => {
    const mapping: Record<string, string> = {
      nom: "nom",
      type: "type",
      typeOrganisation: "type_organisation",
      localisation: "localisation",
      geographie: "geographie",
      geographie2: "geographie2",
      site: "site",
      secteur: "secteur",
      modalite: "modalite",
      services: "services",
      publicCible: "public_cible",
      contacts: "contacts",
      autres: "autres",
      metaDescription: "meta_description",
      metaImage: "image_url",
    };
    return mapping[field] || field;
  };

  const updateField = async (field: keyof Resource, value: string) => {
    try {
      const dbField = getDbFieldName(field);
      const { error, data } = await supabase
        .from("resources")
        .update({ [dbField]: value || null })
        .eq("slug", resource.slug)
        .select();

      if (error) {
        console.error("Error updating field:", {
          field,
          dbField,
          value,
          error: error.message,
          code: error.code,
          details: error.details,
          hint: error.hint,
        });
        throw new Error(error.message || "Erreur lors de l'enregistrement");
      }

      setResource((prev) => ({ ...prev, [field]: value }));
    } catch (err: any) {
      console.error("Error updating field:", err);
      const errorMessage = err?.message || err?.details || "Erreur lors de l'enregistrement. Veuillez réessayer.";
      alert(errorMessage);
      throw err; // Re-throw so the calling code knows it failed
    }
  };

  const getFieldValue = (key: keyof Resource): string => {
    const val = resource[key];
    if (Array.isArray(val)) return "";
    return val || "";
  };

  const handleDeleteResource = async () => {
    setIsDeleting(true);
    try {
      // Delete the resource (hard delete since deleted_at column doesn't exist)
      const { error: resourceError } = await supabase
        .from("resources")
        .delete()
        .eq("slug", resource.slug);

      if (resourceError) throw resourceError;

      // Redirect to home page
      router.push("/");
    } catch (err) {
      console.error("Error deleting resource:", err);
      alert("Erreur lors de la suppression. Veuillez réessayer.");
      setIsDeleting(false);
    }
  };

  const handleScrapeMeta = async () => {
    setIsScraping(true);
    setScrapeMessage(null);
    try {
      const response = await fetch("/api/admin/scrape-meta", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ slug: resource.slug }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Erreur lors du scraping");
      }

      setScrapeMessage(data.message || "Scraping réussi!");
      
      // Fetch updated resource data asynchronously
      try {
        const { data: updatedData, error: fetchError } = await supabase
          .from("resources")
          .select(
            `
            *,
            social_media (
              platform,
              url
            ),
            resource_resource_types (
              resource_type_id,
              resource_types (
                id,
                name,
                slug
              )
            )
          `
          )
          .eq("slug", resource.slug)
          .single();

        if (!fetchError && updatedData) {
          // Update local state with fresh data
          setResource({
            slug: updatedData.slug,
            nom: updatedData.nom || "",
            type: updatedData.type || "",
            types: Array.isArray(updatedData.resource_resource_types)
              ? updatedData.resource_resource_types
                  .map((rrt: any) => rrt.resource_types?.name)
                  .filter((name): name is string => typeof name === "string")
              : (updatedData.type ? [updatedData.type] : []),
            typeOrganisation: updatedData.type_organisation || "",
            localisation: updatedData.localisation || "",
            geographie: updatedData.geographie || "",
            geographie2: updatedData.geographie2 || "",
            site: updatedData.site || "",
            secteur: updatedData.secteur || "",
            modalite: updatedData.modalite || "",
            services: updatedData.services || "",
            publicCible: updatedData.public_cible || "",
            contacts: updatedData.contacts || "",
            autres: updatedData.autres || "",
            supports: Array.isArray(updatedData.supports) ? updatedData.supports : [],
            metaDescription: updatedData.meta_description || null,
            metaImage: updatedData.image_url || null,
            socials: Array.isArray(updatedData.social_media) ? updatedData.social_media : [],
          });
        }
      } catch (fetchErr) {
        console.error("Error fetching updated resource:", fetchErr);
        // Still show success message even if fetch fails
      }
      
      // Also refresh the page to ensure everything is in sync
      router.refresh();
    } catch (err: any) {
      console.error("Error scraping metadata:", err);
      setScrapeMessage(err?.message || "Erreur lors du scraping");
    } finally {
      setIsScraping(false);
    }
  };

  const updateSocialMedia = async (platform: string, url: string) => {
    try {
      const platformLower = platform.toLowerCase();
      
      // Find existing entry
      const existing = resource.socials?.find(
        (s) => s.platform?.toLowerCase() === platformLower
      );

      if (!url.trim()) {
        // Delete if URL is empty
        if (existing) {
          const { error } = await supabase
            .from("social_media")
            .delete()
            .eq("resource_slug", resource.slug)
            .eq("platform", platformLower);

          if (error) throw error;

          setResource((prev) => ({
            ...prev,
            socials: prev.socials?.filter(
              (s) => s.platform?.toLowerCase() !== platformLower
            ) || [],
          }));
        }
      } else {
        // Update or insert
        if (existing) {
          const { error } = await supabase
            .from("social_media")
            .update({ url: url.trim() })
            .eq("resource_slug", resource.slug)
            .eq("platform", platformLower);

          if (error) throw error;

          setResource((prev) => ({
            ...prev,
            socials: prev.socials?.map((s) =>
              s.platform?.toLowerCase() === platformLower
                ? { ...s, url: url.trim() }
                : s
            ) || [],
          }));
        } else {
          const { error } = await supabase
            .from("social_media")
            .insert({
              resource_slug: resource.slug,
              platform: platformLower,
              url: url.trim(),
            });

          if (error) throw error;

          setResource((prev) => ({
            ...prev,
            socials: [
              ...(prev.socials || []),
              { platform: platformLower, url: url.trim() },
            ],
          }));
        }
      }
    } catch (err) {
      console.error("Error updating social media:", err);
      alert("Erreur lors de l'enregistrement. Veuillez réessayer.");
    }
  };

  const splitParts = (val: string) =>
    val
      .split("/")
      .map((p) => p.trim())
      .filter(Boolean);

  // Use types array, fallback to type for backward compatibility
  const typeParts = resource.types && resource.types.length > 0 
    ? resource.types.filter(Boolean).map(t => t.trim())
    : (resource.type ? [resource.type.trim()] : []);
  const supportParts = resource.supports.flatMap(splitParts);
  
  const [showTypeDropdown, setShowTypeDropdown] = useState(false);
  const [isAddingType, setIsAddingType] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowTypeDropdown(false);
      }
    }
    if (showTypeDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [showTypeDropdown]);

  // Get available types that aren't already added
  const availableTypes = resourceTypes
    .map(rt => rt.originalType)
    .filter(type => !typeParts.includes(type));

  const addType = async (typeToAdd: string) => {
    if (isAddingType || typeParts.includes(typeToAdd)) return;
    
    setIsAddingType(true);
    try {
      console.log("Adding type:", typeToAdd);
      
      // Find the resource type in our local list first to get the slug
      const resourceType = resourceTypes.find(rt => rt.originalType === typeToAdd.trim());
      
      if (!resourceType) {
        console.error("Type not found in resourceTypes:", typeToAdd);
        throw new Error(`Type "${typeToAdd}" not found in application types`);
      }

      console.log("Found resourceType:", resourceType.slug);

      // Use slug to find the type in database (more reliable than name matching)
      const { data: typeData, error: typeError } = await supabase
        .from("resource_types")
        .select("id, name, slug")
        .eq("slug", resourceType.slug)
        .maybeSingle();

      console.log("Type data by slug:", typeData, "Error:", typeError);

      if (typeError) {
        console.error("Error fetching type by slug:", typeError);
        // Don't throw yet, try by name as fallback
      }

      let typeId: number | null = null;
      
      if (typeData?.id) {
        typeId = typeData.id;
        console.log("Found type by slug, ID:", typeId);
      } else {
        // Fallback: try by name if slug doesn't work
        console.log("Trying to find by name:", typeToAdd.trim());
        const { data: typeDataByName, error: nameError } = await supabase
          .from("resource_types")
          .select("id, name, slug")
          .eq("name", typeToAdd.trim())
          .maybeSingle();
        
        console.log("Type data by name:", typeDataByName, "Error:", nameError);
        
        if (nameError) {
          console.error("Error fetching type by name:", nameError);
        }
        
        if (typeDataByName?.id) {
          typeId = typeDataByName.id;
          console.log("Found type by name, ID:", typeId);
        } else {
          // Last resort: list all types to see what's in the database
          const { data: allTypes, error: allTypesError } = await supabase
            .from("resource_types")
            .select("id, name, slug")
            .order("name");
          
          console.log("All types in database:", allTypes, "Error:", allTypesError);
          
          if (allTypes && allTypes.length > 0) {
            const matchingType = allTypes.find((t: any) => 
              t.name.toLowerCase().includes(typeToAdd.toLowerCase().trim()) ||
              typeToAdd.toLowerCase().trim().includes(t.name.toLowerCase())
            );
            
            if (matchingType) {
              console.log("Found approximate match:", matchingType);
              typeId = matchingType.id;
            }
          }
        }
      }

      if (!typeId) {
        // Type not found - this shouldn't happen if migration was run correctly
        console.error("Type not found in database:", {
          typeToAdd,
          resourceTypeSlug: resourceType.slug,
          allTypesInDb: await supabase.from("resource_types").select("id, name, slug"),
        });
        throw new Error(
          `Type "${typeToAdd}" not found in database. ` +
          `Vérifiez que la migration 0006_create_resource_types_relation.sql a été exécutée. ` +
          `Exécutez "npm run init:types" pour initialiser les types.`
        );
      }

      // Insert into junction table
      const { error } = await supabase
        .from("resource_resource_types")
        .insert({
          resource_slug: resource.slug,
          resource_type_id: typeId,
        });

      if (error) {
        console.error("Error adding type - Supabase error:", error);
        console.error("Error details:", {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code,
        });
        throw error;
      }

      // Refresh the resource data
      const { data: updatedResource } = await supabase
        .from("resources")
        .select(
          `
          *,
          resource_resource_types (
            resource_type_id,
            resource_types (
              id,
              name,
              slug
            )
          )
        `
        )
        .eq("slug", resource.slug)
        .single();

      if (updatedResource) {
        const newTypes = Array.isArray(updatedResource.resource_resource_types)
          ? updatedResource.resource_resource_types
              .map((rrt: any) => rrt.resource_types?.name)
              .filter((name): name is string => typeof name === "string")
          : [];
        setResource((prev) => ({ ...prev, types: newTypes }));
      }

      setShowTypeDropdown(false);
    } catch (err: any) {
      console.error("Error adding type:", err);
      const errorMessage = err?.message || err?.details || err?.hint || "Erreur inconnue";
      const errorCode = err?.code || "";
      alert(
        `Erreur lors de l'ajout du type: ${errorMessage}${errorCode ? ` (Code: ${errorCode})` : ""}`
      );
    } finally {
      setIsAddingType(false);
    }
  };

  const removeType = async (typeToRemove: string) => {
    if (isAddingType) return;
    
    setIsAddingType(true);
    try {
      console.log("Removing type:", typeToRemove);
      
      // Find the resource type in our local list first to get the slug
      const resourceType = resourceTypes.find(rt => rt.originalType === typeToRemove.trim());
      
      let typeId: number | null = null;

      // Use slug to find the type in database (more reliable than name matching)
      if (resourceType) {
        const { data: typeData, error: typeError } = await supabase
          .from("resource_types")
          .select("id")
          .eq("slug", resourceType.slug)
          .maybeSingle();

        console.log("Type data by slug:", typeData, "Error:", typeError);

        if (!typeError && typeData?.id) {
          typeId = typeData.id;
        }
      }

      // Fallback: try by name if slug doesn't work
      if (!typeId) {
        const { data: typeDataByName, error: nameError } = await supabase
          .from("resource_types")
          .select("id")
          .eq("name", typeToRemove.trim())
          .maybeSingle();

        console.log("Type data by name:", typeDataByName, "Error:", nameError);

        if (nameError) {
          console.error("Error fetching type:", nameError);
          throw new Error(`Erreur lors de la recherche du type: ${nameError.message}`);
        }

        if (typeDataByName?.id) {
          typeId = typeDataByName.id;
        }
      }

      if (!typeId) {
        throw new Error(`Type "${typeToRemove}" not found in database`);
      }

      // Delete from junction table
      const { error, data: deleteData } = await supabase
        .from("resource_resource_types")
        .delete()
        .eq("resource_slug", resource.slug)
        .eq("resource_type_id", typeId)
        .select();

      console.log("Delete result:", deleteData, "Error:", error);

      if (error) {
        console.error("Error removing type - Supabase error:", error);
        console.error("Error details:", {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code,
        });
        throw error;
      }

      // Refresh the resource data
      const { data: updatedResource, error: fetchError } = await supabase
        .from("resources")
        .select(
          `
          *,
          resource_resource_types (
            resource_type_id,
            resource_types (
              id,
              name,
              slug
            )
          )
        `
        )
        .eq("slug", resource.slug)
        .single();

      if (fetchError) {
        console.error("Error fetching updated resource:", fetchError);
      }

      if (updatedResource) {
        const newTypes = Array.isArray(updatedResource.resource_resource_types)
          ? updatedResource.resource_resource_types
              .map((rrt: any) => rrt.resource_types?.name)
              .filter((name): name is string => typeof name === "string")
          : [];
        console.log("Updated types:", newTypes);
        setResource((prev) => ({ ...prev, types: newTypes }));
      }
    } catch (err: any) {
      console.error("Error removing type:", err);
      const errorMessage = err?.message || err?.details || err?.hint || "Erreur inconnue";
      const errorCode = err?.code || "";
      alert(
        `Erreur lors de la suppression du type: ${errorMessage}${errorCode ? ` (Code: ${errorCode})` : ""}\n\n` +
        `Vérifiez la console pour plus de détails.`
      );
    } finally {
      setIsAddingType(false);
    }
  };

  const handleOpenImageModal = async () => {
    if (!resource.site) {
      alert("Cette ressource n'a pas d'URL de site web.");
      return;
    }

    setShowImageModal(true);
    setIsLoadingImages(true);
    setScrapedImages([]);

    try {
      const response = await fetch("/api/admin/scrape-images", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url: resource.site }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Erreur lors du scraping des images");
      }

      setScrapedImages(data.images || []);
    } catch (err: any) {
      console.error("Error scraping images:", err);
      alert(err?.message || "Erreur lors du scraping des images");
    } finally {
      setIsLoadingImages(false);
    }
  };

  const handleSelectImage = async (imageUrl: string) => {
    if (isUpdatingImage) return;

    setIsUpdatingImage(true);
    try {
      const response = await fetch("/api/admin/update-resource-image", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          slug: resource.slug,
          imageUrl,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        const errorMessage = data.details 
          ? `${data.error}: ${data.details}`
          : data.error || "Erreur lors de la mise à jour de l'image";
        throw new Error(errorMessage);
      }

      // Update local state
      setResource((prev) => ({ ...prev, metaImage: data.imageUrl }));
      
      // Close modal
      setShowImageModal(false);
      
      // Refresh the page to ensure everything is in sync
      router.refresh();
    } catch (err: any) {
      console.error("Error updating image:", err);
      alert(err?.message || "Erreur lors de la mise à jour de l'image");
    } finally {
      setIsUpdatingImage(false);
    }
  };

  return (
    <main className="re-detail re-detail--visible">
      <div className="re-container re-detail-inner">
        <section>
          <div className="re-detail-header">
            <h2>
              <EditableField
                field="nom"
                value={getFieldValue("nom")}
                isEditing={isEditMode}
                onSave={(val) => updateField("nom", val)}
              />
            </h2>
            <div>
              {isEditMode ? (
                <span style={{ display: "inline-flex", alignItems: "center", gap: "0.25rem", flexWrap: "wrap" }}>
                  <EditableField
                    field="type"
                    value={getFieldValue("type")}
                    isEditing={isEditMode}
                    onSave={(val) => updateField("type", val)}
                  />
                  {getFieldValue("secteur") && (
                    <>
                      <span>•</span>
                      <EditableField
                        field="secteur"
                        value={getFieldValue("secteur")}
                        isEditing={isEditMode}
                        onSave={(val) => updateField("secteur", val)}
                      />
                    </>
                  )}
                </span>
              ) : (
                <>
                  {resource.type}{" "}
                  {resource.secteur ? ` • ${resource.secteur}` : null}
                </>
              )}
            </div>
          </div>

          <div style={{ marginTop: "0.75rem", position: "relative" }}>
            <img
              src={resource.metaImage || "/ressources_images/placeholder.svg"}
              alt={resource.nom}
              style={{
                width: "100%",
                maxHeight: 280,
                objectFit: "cover",
                borderRadius: "0.8rem",
                border: "1px solid rgba(148,163,184,0.35)",
              }}
              referrerPolicy="no-referrer"
            />
            {isAdmin && isEditMode && (
              <button
                type="button"
                onClick={handleOpenImageModal}
                style={{
                  position: "absolute",
                  top: "0.75rem",
                  right: "0.75rem",
                  padding: "0.5rem 1rem",
                  background: "rgba(255, 255, 255, 0.95)",
                  border: "1px solid #d1d5db",
                  borderRadius: "0.5rem",
                  color: "#374151",
                  fontSize: "0.875rem",
                  fontWeight: 500,
                  cursor: "pointer",
                  boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                  transition: "all 160ms ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "#ffffff";
                  e.currentTarget.style.borderColor = "#3b82f6";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "rgba(255, 255, 255, 0.95)";
                  e.currentTarget.style.borderColor = "#d1d5db";
                }}
              >
                Changer l'image
              </button>
            )}
          </div>

          <div className="re-card-tags" style={{ marginTop: "0.75rem", position: "relative" }}>
            {typeParts.map((type, i) => {
              // Find matching category - first check if the full resource type matches
              const fullTypeCategory = resourceTypes.find(rt => rt.originalType === type);
              
              // If no direct match, try to find by type
              const partCategory = fullTypeCategory || getCategoryForResourceType(type);
              
              const tagContent = (
                <>
                  <span>{type}</span>
                  {isAdmin && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        removeType(type);
                      }}
                      disabled={isAddingType}
                      style={{
                        marginLeft: "0.375rem",
                        background: "transparent",
                        border: "none",
                        color: "inherit",
                        cursor: isAddingType ? "not-allowed" : "pointer",
                        fontSize: "0.875rem",
                        padding: "0",
                        width: "1rem",
                        height: "1rem",
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        borderRadius: "50%",
                        transition: "background 160ms ease, color 160ms ease",
                        opacity: 0.7,
                      }}
                      onMouseEnter={(e) => {
                        if (!isAddingType) {
                          e.currentTarget.style.background = "rgba(220, 38, 38, 0.1)";
                          e.currentTarget.style.color = "#dc2626";
                          e.currentTarget.style.opacity = "1";
                        }
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = "transparent";
                        e.currentTarget.style.color = "inherit";
                        e.currentTarget.style.opacity = "0.7";
                      }}
                      title="Supprimer ce type"
                    >
                      ×
                    </button>
                  )}
                </>
              );
              
              return (
                <span
                  key={`type-${i}-${type}`}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    marginRight: "0.5rem",
                    marginBottom: "0.5rem",
                  }}
                >
                  {partCategory ? (
                    <Link
                      href={`/type/${partCategory.slug}`}
                      className="re-tag re-tag--type re-tag--link"
                      style={{ 
                        textDecoration: "none",
                        display: "inline-flex",
                        alignItems: "center",
                      }}
                      onClick={(e) => {
                        // Don't navigate if clicking the X button
                        const target = e.target as HTMLElement;
                        if (target.tagName === "BUTTON" || target.closest("button")) {
                          e.preventDefault();
                        }
                      }}
                    >
                      {tagContent}
                    </Link>
                  ) : (
                    <span 
                      className="re-tag re-tag--type"
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                      }}
                    >
                      {tagContent}
                    </span>
                  )}
                </span>
              );
            })}
            {isAdmin && (
              <span style={{ position: "relative", display: "inline-block" }}>
                <button
                  type="button"
                  onClick={() => setShowTypeDropdown(!showTypeDropdown)}
                  disabled={isAddingType || availableTypes.length === 0}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "0.375rem 0.75rem",
                    background: showTypeDropdown ? "#3b82f6" : "#f3f4f6",
                    border: "1px solid #d1d5db",
                    borderRadius: "0.5rem",
                    color: showTypeDropdown ? "white" : "#6b7280",
                    cursor: isAddingType || availableTypes.length === 0 ? "not-allowed" : "pointer",
                    fontSize: "0.875rem",
                    fontWeight: 500,
                    transition: "all 160ms ease",
                    marginRight: "0.5rem",
                    marginBottom: "0.5rem",
                  }}
                  onMouseEnter={(e) => {
                    if (!isAddingType && availableTypes.length > 0 && !showTypeDropdown) {
                      e.currentTarget.style.background = "#e5e7eb";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!showTypeDropdown) {
                      e.currentTarget.style.background = "#f3f4f6";
                    }
                  }}
                  title="Ajouter un type"
                >
                  +
                </button>
                {showTypeDropdown && availableTypes.length > 0 && (
                  <div
                    ref={dropdownRef}
                    style={{
                      position: "absolute",
                      top: "100%",
                      left: 0,
                      marginTop: "0.25rem",
                      background: "white",
                      border: "1px solid #d1d5db",
                      borderRadius: "0.5rem",
                      boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
                      zIndex: 1000,
                      minWidth: "200px",
                      maxHeight: "300px",
                      overflowY: "auto",
                    }}
                  >
                    {availableTypes.map((type) => (
                      <button
                        key={type}
                        type="button"
                        onClick={() => addType(type)}
                        disabled={isAddingType}
                        style={{
                          width: "100%",
                          padding: "0.5rem 0.75rem",
                          textAlign: "left",
                          background: "transparent",
                          border: "none",
                          cursor: isAddingType ? "not-allowed" : "pointer",
                          fontSize: "0.875rem",
                          color: "#374151",
                          transition: "background 160ms ease",
                        }}
                        onMouseEnter={(e) => {
                          if (!isAddingType) {
                            e.currentTarget.style.background = "#f3f4f6";
                          }
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = "transparent";
                        }}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                )}
              </span>
            )}
            {supportParts.map((p, i) => (
              <span key={`sup-${i}-${p}`} className="re-tag">
                {p}
              </span>
            ))}
          </div>

          {resource.metaDescription && (
            <div className="re-detail-section">
              <h3>Description</h3>
              <div>
                <EditableField
                  field="metaDescription"
                  value={resource.metaDescription || ""}
                  isEditing={isEditMode}
                  onSave={(val) => updateField("metaDescription", val)}
                />
              </div>
            </div>
          )}

          <div className="re-detail-section">
            <h3>Services principaux</h3>
            <div>
              <EditableField
                field="services"
                value={getFieldValue("services")}
                isEditing={isEditMode}
                onSave={(val) => updateField("services", val)}
                placeholder="Description détaillée des services à consulter sur le site officiel de la ressource."
              />
            </div>
          </div>

          {(resource.autres || isEditMode) && (
            <div className="re-detail-section">
              <h3>Informations additionnelles</h3>
              <div>
                <EditableField
                  field="autres"
                  value={getFieldValue("autres")}
                  isEditing={isEditMode}
                  onSave={(val) => updateField("autres", val)}
                  placeholder={isEditMode ? "Ajouter des informations additionnelles" : undefined}
                />
              </div>
            </div>
          )}

          <Link href="/" className="re-detail-close">
            Retour à la liste
          </Link>
        </section>

        <aside className="re-detail-sidebar">
          {isAdmin && (
            <div className="re-admin-box">
              <h3 className="re-admin-box-title">Outils administrateur</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                <button
                  type="button"
                  className="re-btn-primary"
                  onClick={() => setIsEditMode(!isEditMode)}
                >
                  {isEditMode ? "Terminé" : "Modifier"}
                </button>
                <button
                  type="button"
                  className="re-btn-secondary"
                  onClick={handleScrapeMeta}
                  disabled={isScraping}
                  style={{
                    opacity: isScraping ? 0.6 : 1,
                    cursor: isScraping ? "not-allowed" : "pointer",
                  }}
                >
                  {isScraping ? "Scraping en cours..." : "Scraper les métadonnées"}
                </button>
                {scrapeMessage && (
                  <div
                    style={{
                      padding: "0.5rem",
                      fontSize: "0.85rem",
                      color: scrapeMessage.includes("Erreur") ? "#ef4444" : "#059669",
                      backgroundColor: scrapeMessage.includes("Erreur") ? "#fef2f2" : "#f0fdf4",
                      borderRadius: "0.375rem",
                    }}
                  >
                    {scrapeMessage}
                  </div>
                )}
                <button
                  type="button"
                  className="re-btn-secondary"
                  onClick={() => setShowDeleteModal(true)}
                  style={{
                    borderColor: "#ef4444",
                    color: "#ef4444",
                  }}
                >
                  Supprimer la ressource
                </button>
              </div>
            </div>
          )}

          <div className="re-detail-sidebar-row">
            <span className="re-detail-sidebar-label">Localisation</span>
            <span>
              <EditableField
                field="localisation"
                value={
                  resource.localisation ||
                  resource.geographie2 ||
                  resource.geographie ||
                  "Canada"
                }
                isEditing={isEditMode}
                onSave={(val) => updateField("localisation", val)}
              />
            </span>
          </div>

          {(resource.typeOrganisation || isEditMode) && (
            <div className="re-detail-sidebar-row">
              <span className="re-detail-sidebar-label">Type d'organisation</span>
              <span>
                <EditableField
                  field="typeOrganisation"
                  value={getFieldValue("typeOrganisation")}
                  isEditing={isEditMode}
                  onSave={(val) => updateField("typeOrganisation", val)}
                  placeholder={isEditMode ? "Ajouter un type d'organisation" : undefined}
                />
              </span>
            </div>
          )}

          {(resource.secteur || isEditMode) && (
            <div className="re-detail-sidebar-row">
              <span className="re-detail-sidebar-label">Secteur</span>
              <span>
                <EditableField
                  field="secteur"
                  value={getFieldValue("secteur")}
                  isEditing={isEditMode}
                  onSave={(val) => updateField("secteur", val)}
                  placeholder={isEditMode ? "Ajouter un secteur" : undefined}
                />
              </span>
            </div>
          )}

          {(resource.publicCible || isEditMode) && (
            <div className="re-detail-sidebar-row">
              <span className="re-detail-sidebar-label">Public cible</span>
              <span>
                <EditableField
                  field="publicCible"
                  value={getFieldValue("publicCible")}
                  isEditing={isEditMode}
                  onSave={(val) => updateField("publicCible", val)}
                  placeholder={isEditMode ? "Ajouter un public cible" : undefined}
                />
              </span>
            </div>
          )}

          {(resource.modalite || isEditMode) && (
            <div className="re-detail-sidebar-row">
              <span className="re-detail-sidebar-label">Modalités</span>
              <span>
                <EditableField
                  field="modalite"
                  value={getFieldValue("modalite")}
                  isEditing={isEditMode}
                  onSave={(val) => updateField("modalite", val)}
                  placeholder={isEditMode ? "Ajouter des modalités" : undefined}
                />
              </span>
            </div>
          )}

          {(resource.contacts || isEditMode) && (
            <div className="re-detail-sidebar-row">
              <span className="re-detail-sidebar-label">Contact</span>
              <span>
                <EditableField
                  field="contacts"
                  value={getFieldValue("contacts")}
                  isEditing={isEditMode}
                  onSave={(val) => updateField("contacts", val)}
                  placeholder={isEditMode ? "Ajouter des informations de contact" : undefined}
                />
              </span>
            </div>
          )}

          {(resource.site || isEditMode) && (
            <div className="re-detail-sidebar-row">
              <span className="re-detail-sidebar-label">Site web</span>
              {isEditMode ? (
                <EditableField
                  field="site"
                  value={getFieldValue("site")}
                  isEditing={isEditMode}
                  onSave={(val) => updateField("site", val)}
                  placeholder={isEditMode ? "Ajouter une URL" : undefined}
                />
              ) : resource.site ? (
                <a 
                  href={resource.site} 
                  target="_blank" 
                  rel="noreferrer"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "0.375rem",
                    textDecoration: "none",
                    color: "inherit",
                  }}
                >
                  <span>{resource.site}</span>
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    style={{ flexShrink: 0, opacity: 0.6 }}
                    aria-hidden="true"
                  >
                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                    <polyline points="15 3 21 3 21 9"></polyline>
                    <line x1="10" y1="14" x2="21" y2="3"></line>
                  </svg>
                </a>
              ) : null}
            </div>
          )}

          {(resource.socials && resource.socials.length > 0) || isEditMode ? (
            <>
              {SOCIAL_PLATFORMS.map((platform) => {
                const existingSocial = resource.socials?.find(
                  (s) => s.platform?.toLowerCase() === platform.key
                );
                const url = existingSocial?.url || "";
                const platformKey = platform.key;

                if (!isEditMode && !url) {
                  // Don't show empty platforms when not in edit mode
                  return null;
                }

                let handle = "";
                if (url && !isEditMode) {
                  try {
                    const urlObj = new URL(url);
                    const pathname = urlObj.pathname;
                    const segments = pathname.split("/").filter(Boolean);
                    handle = segments[segments.length - 1] || urlObj.hostname;

                    if (
                      platformKey === "instagram" ||
                      platformKey === "twitter" ||
                      platformKey === "tiktok"
                    ) {
                      if (!handle.startsWith("@")) {
                        handle = "@" + handle;
                      }
                    }
                  } catch {
                    handle = url;
                  }
                }

                return (
                  <div key={platformKey} className="re-detail-sidebar-row">
                    <span className="re-detail-sidebar-label">{platform.label}</span>
                    {isEditMode ? (
                      <EditableField
                        field={`social-${platformKey}`}
                        value={url}
                        isEditing={isEditMode}
                        onSave={(val) => updateSocialMedia(platformKey, val)}
                        placeholder={`Ajouter une URL ${platform.label}`}
                      />
                    ) : url ? (
                      <a
                        href={url}
                        target="_blank"
                        rel="noreferrer"
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "0.5rem",
                          textDecoration: "none",
                          color: "inherit",
                        }}
                      >
                        <SocialIcon platform={platformKey} size={20} />
                        <span style={{ fontSize: "0.9rem" }}>{handle}</span>
                        <svg
                          width="12"
                          height="12"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          style={{ flexShrink: 0, opacity: 0.6 }}
                          aria-hidden="true"
                        >
                          <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                          <polyline points="15 3 21 3 21 9"></polyline>
                          <line x1="10" y1="14" x2="21" y2="3"></line>
                        </svg>
                      </a>
                    ) : null}
                  </div>
                );
              })}
            </>
          ) : null}
        </aside>
      </div>

      {showDeleteModal && (
        <div className="re-modal">
          <div className="re-modal-backdrop" onClick={() => setShowDeleteModal(false)} />
          <div className="re-modal-dialog" role="dialog" aria-modal="true">
            <div className="re-modal-header">
              <h3>Supprimer la ressource</h3>
              <button
                type="button"
                onClick={() => setShowDeleteModal(false)}
                style={{
                  position: "absolute",
                  top: "1rem",
                  right: "1rem",
                  background: "transparent",
                  border: "none",
                  fontSize: "1.5rem",
                  cursor: "pointer",
                  color: "#6b7280",
                  width: "2rem",
                  height: "2rem",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: "4px",
                  transition: "background 160ms ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "#f3f4f6";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "transparent";
                }}
              >
                ×
              </button>
            </div>
            <div className="re-modal-body">
              <p>
                Êtes-vous sûr de vouloir supprimer la ressource{" "}
                <strong>{resource.nom}</strong> ?
              </p>
              <p style={{ marginTop: "0.75rem", color: "#ef4444", fontSize: "0.9rem" }}>
                Cette action est irréversible.
              </p>
            </div>
            <div className="re-modal-footer" style={{ justifyContent: "flex-end", gap: "0.75rem" }}>
              <button
                type="button"
                className="re-btn-link"
                onClick={() => setShowDeleteModal(false)}
                disabled={isDeleting}
              >
                Annuler
              </button>
              <button
                type="button"
                className="re-btn-primary"
                onClick={handleDeleteResource}
                disabled={isDeleting}
                style={{
                  background: "#ef4444",
                  borderColor: "#ef4444",
                }}
              >
                {isDeleting ? "Suppression…" : "Supprimer"}
              </button>
            </div>
          </div>
        </div>
      )}

      {showImageModal && (
        <div className="re-modal">
          <div className="re-modal-backdrop" onClick={() => setShowImageModal(false)} />
          <div className="re-modal-dialog" role="dialog" aria-modal="true" style={{ maxWidth: "90vw", width: "1000px", maxHeight: "90vh" }}>
            <div className="re-modal-header">
              <h3>Choisir une nouvelle image</h3>
              <button
                type="button"
                onClick={() => setShowImageModal(false)}
                style={{
                  position: "absolute",
                  top: "1rem",
                  right: "1rem",
                  background: "transparent",
                  border: "none",
                  fontSize: "1.5rem",
                  cursor: "pointer",
                  color: "#6b7280",
                  width: "2rem",
                  height: "2rem",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: "4px",
                  transition: "background 160ms ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "#f3f4f6";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "transparent";
                }}
              >
                ×
              </button>
            </div>
            <div className="re-modal-body" style={{ maxHeight: "calc(90vh - 200px)", overflowY: "auto" }}>
              {isLoadingImages ? (
                <div style={{ textAlign: "center", padding: "3rem", color: "#6b7280" }}>
                  <p>Scraping des images en cours...</p>
                </div>
              ) : scrapedImages.length === 0 ? (
                <div style={{ textAlign: "center", padding: "3rem", color: "#6b7280" }}>
                  <p>Aucune image trouvée sur le site web.</p>
                </div>
              ) : (
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
                    gap: "1rem",
                    padding: "0.5rem",
                  }}
                >
                  {scrapedImages.map((img, index) => (
                    <div
                      key={index}
                      style={{
                        position: "relative",
                        aspectRatio: "16/9",
                        borderRadius: "0.5rem",
                        overflow: "hidden",
                        border: "2px solid #e5e7eb",
                        cursor: isUpdatingImage ? "not-allowed" : "pointer",
                        transition: "all 160ms ease",
                        opacity: isUpdatingImage ? 0.6 : 1,
                      }}
                      onClick={() => !isUpdatingImage && handleSelectImage(img.url)}
                      onMouseEnter={(e) => {
                        if (!isUpdatingImage) {
                          e.currentTarget.style.borderColor = "#3b82f6";
                          e.currentTarget.style.transform = "scale(1.02)";
                        }
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = "#e5e7eb";
                        e.currentTarget.style.transform = "scale(1)";
                      }}
                    >
                      <img
                        src={img.url}
                        alt={`Image ${index + 1}`}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                        referrerPolicy="no-referrer"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = "none";
                        }}
                      />
                      {img.source === "meta" && (
                        <div
                          style={{
                            position: "absolute",
                            top: "0.5rem",
                            left: "0.5rem",
                            background: "rgba(59, 130, 246, 0.9)",
                            color: "white",
                            padding: "0.25rem 0.5rem",
                            borderRadius: "0.25rem",
                            fontSize: "0.75rem",
                            fontWeight: 500,
                          }}
                        >
                          Meta
                        </div>
                      )}
                      {isUpdatingImage && (
                        <div
                          style={{
                            position: "absolute",
                            inset: 0,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            background: "rgba(0, 0, 0, 0.5)",
                            color: "white",
                            fontSize: "0.875rem",
                          }}
                        >
                          Mise à jour...
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="re-modal-footer" style={{ justifyContent: "flex-end" }}>
              <button
                type="button"
                className="re-btn-link"
                onClick={() => setShowImageModal(false)}
                disabled={isUpdatingImage}
              >
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}


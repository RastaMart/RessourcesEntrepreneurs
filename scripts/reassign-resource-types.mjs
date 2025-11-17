import { createClient } from "@supabase/supabase-js";
import * as dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, "..", ".env.local") });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase credentials");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Mapping function (simplified version of the TypeScript one)
function mapResourceTypeToCategory(resourceType) {
  if (!resourceType || !resourceType.trim()) {
    return null;
  }

  const normalizedType = resourceType.trim().toLowerCase();

  const categories = [
    {
      originalType: "Mentorat / coaching",
      keywords: ["mentorat", "coaching"]
    },
    {
      originalType: "Incubation & accélération",
      keywords: ["incubateur", "incubation", "accélérateur", "accélération", "accelerateur", "acceleration"]
    },
    {
      originalType: "Formation & développement de compétences",
      keywords: ["formation", "compétence", "competence", "développement", "developpement", "apprentissage"]
    },
    {
      originalType: "Réseautage & communauté",
      keywords: ["réseautage", "reseau", "communauté", "communaute", "réseau", "ressources /", "programmes /"]
    },
    {
      originalType: "Conseils techniques ou sectoriels",
      keywords: ["conseil", "conseils", "sectoriel", "technique"]
    },
    {
      originalType: "Support administratif / réglementaire",
      keywords: ["administratif", "réglementaire", "reglementaire", "juridique", "info /", "orientation"]
    },
    {
      originalType: "Support au marketing / commercialisation / accès au marché",
      keywords: ["marketing", "commercialisation", "commercial", "marché", "marche", "export", "international", "vente"]
    },
    {
      originalType: "Support technologique / numérique",
      keywords: ["technologique", "numérique", "numerique", "digital", "ai", "prototypage", "fab lab", "fablab", "microélectronique", "microelectronique"]
    },
    {
      originalType: "Support thématique ou pour groupes sous-représentés",
      keywords: ["thématique", "thematique", "femmes", "sous-représentés", "sous-representes", "impact social", "social"]
    },
    {
      originalType: "Accès aux infrastructures ou ressources physiques",
      keywords: ["infrastructure", "équipement", "equipement", "bureau", "coworking", "espace", "physique", "laser", "bureaux flexibles"]
    },
    {
      originalType: "Soutien à l'innovation et recherche/développement (R&D)",
      keywords: ["innovation", "r&d", "rd", "recherche", "développement", "developpement", "biotech", "laboratoire"]
    },
    {
      originalType: "Soutien global de croissance & planification stratégique",
      keywords: ["croissance", "stratégie", "strategie", "planification", "accompagnement", "financement", "investissement", "soutien global"]
    }
  ];

  // Direct match
  const directMatch = categories.find(cat => 
    cat.originalType.toLowerCase() === normalizedType
  );
  if (directMatch) {
    return directMatch.originalType;
  }

  // Keyword matching
  let bestMatch = null;
  let bestScore = 0;

  for (const category of categories) {
    const score = category.keywords.reduce((acc, keyword) => {
      if (normalizedType.includes(keyword)) {
        return acc + 1;
      }
      return acc;
    }, 0);

    if (score > bestScore) {
      bestScore = score;
      bestMatch = category;
    }
  }

  if (bestMatch && bestScore > 0) {
    return bestMatch.originalType;
  }

  // Fallback: substring matching
  for (const category of categories) {
    const keywords = category.originalType.toLowerCase().split(/[\s\/&]+/);
    for (const keyword of keywords) {
      if (normalizedType.includes(keyword) || keyword.includes(normalizedType)) {
        return category.originalType;
      }
    }
  }

  return null;
}

async function reassignResourceTypes() {
  console.log("Fetching all resources...");
  
  const { data: resources, error: fetchError } = await supabase
    .from("resources")
    .select("slug, type");

  if (fetchError) {
    console.error("Error fetching resources:", fetchError);
    return;
  }

  if (!resources || resources.length === 0) {
    console.log("No resources found");
    return;
  }

  console.log(`Found ${resources.length} resources`);
  console.log("\nMapping resource types...\n");

  const updates = [];
  const unmapped = [];

  for (const resource of resources) {
    const mappedType = mapResourceTypeToCategory(resource.type);
    
    if (mappedType && mappedType !== resource.type) {
      updates.push({
        slug: resource.slug,
        oldType: resource.type,
        newType: mappedType
      });
      console.log(`✓ ${resource.slug}: "${resource.type}" → "${mappedType}"`);
    } else if (!mappedType && resource.type) {
      unmapped.push({
        slug: resource.slug,
        type: resource.type
      });
      console.log(`⚠ ${resource.slug}: Could not map "${resource.type}"`);
    }
  }

  console.log(`\n\nSummary:`);
  console.log(`- Mapped: ${updates.length}`);
  console.log(`- Unmapped: ${unmapped.length}`);

  if (unmapped.length > 0) {
    console.log(`\nUnmapped resources:`);
    unmapped.forEach(r => {
      console.log(`  - ${r.slug}: "${r.type}"`);
    });
  }

  if (updates.length === 0) {
    console.log("\nNo updates needed.");
    return;
  }

  console.log(`\n\nUpdating ${updates.length} resources...`);

  let successCount = 0;
  let errorCount = 0;

  for (const update of updates) {
    const { error } = await supabase
      .from("resources")
      .update({ type: update.newType })
      .eq("slug", update.slug);

    if (error) {
      console.error(`✗ Error updating ${update.slug}:`, error.message);
      errorCount++;
    } else {
      successCount++;
    }
  }

  console.log(`\n\nUpdate complete:`);
  console.log(`- Success: ${successCount}`);
  console.log(`- Errors: ${errorCount}`);
}

reassignResourceTypes().catch(console.error);


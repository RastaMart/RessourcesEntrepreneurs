import { resourceTypes, type ResourceType } from "./resourceTypes";

/**
 * Maps an existing resource type string to one of the 12 standardized categories
 */
export function mapResourceTypeToCategory(resourceType: string | null | undefined): string | null {
  if (!resourceType || !resourceType.trim()) {
    return null;
  }

  const normalizedType = resourceType.trim().toLowerCase();

  // Direct matches first
  const directMatch = resourceTypes.find(rt => 
    rt.originalType.toLowerCase() === normalizedType
  );
  if (directMatch) {
    return directMatch.originalType;
  }

  // Keyword-based matching
  const keywordMatches: Array<{ keywords: string[]; category: ResourceType }> = [
    {
      keywords: ["mentorat", "coaching"],
      category: resourceTypes[0] // mentorat-coaching
    },
    {
      keywords: ["incubateur", "incubation", "accélérateur", "accélération", "accelerateur", "acceleration"],
      category: resourceTypes[1] // incubation-acceleration
    },
    {
      keywords: ["formation", "compétence", "competence", "développement", "developpement", "apprentissage"],
      category: resourceTypes[2] // formation-competences
    },
    {
      keywords: ["réseautage", "reseau", "communauté", "communaute", "réseau", "ressources /", "programmes /"],
      category: resourceTypes[3] // reseautage-communaute
    },
    {
      keywords: ["conseil", "conseils", "sectoriel", "technique"],
      category: resourceTypes[4] // conseils-techniques
    },
    {
      keywords: ["administratif", "réglementaire", "reglementaire", "juridique", "info /", "orientation"],
      category: resourceTypes[5] // support-administratif
    },
    {
      keywords: ["marketing", "commercialisation", "commercial", "marché", "marche", "export", "international", "vente"],
      category: resourceTypes[6] // marketing-commercialisation
    },
    {
      keywords: ["technologique", "numérique", "numerique", "digital", "ai", "prototypage", "fab lab", "fablab", "microélectronique", "microelectronique"],
      category: resourceTypes[7] // support-technologique
    },
    {
      keywords: ["thématique", "thematique", "femmes", "sous-représentés", "sous-representes", "impact social", "social"],
      category: resourceTypes[8] // support-thematique
    },
    {
      keywords: ["infrastructure", "équipement", "equipement", "bureau", "coworking", "espace", "physique", "laser", "bureaux flexibles"],
      category: resourceTypes[9] // infrastructures
    },
    {
      keywords: ["innovation", "r&d", "rd", "recherche", "développement", "developpement", "biotech", "laboratoire", "prototypage"],
      category: resourceTypes[10] // innovation-rd
    },
    {
      keywords: ["croissance", "stratégie", "strategie", "planification", "accompagnement", "financement", "investissement", "soutien global"],
      category: resourceTypes[11] // croissance-strategie
    }
  ];

  // Find the best match by counting keyword matches
  let bestMatch: ResourceType | null = null;
  let bestScore = 0;

  for (const match of keywordMatches) {
    const score = match.keywords.reduce((acc, keyword) => {
      if (normalizedType.includes(keyword)) {
        return acc + 1;
      }
      return acc;
    }, 0);

    if (score > bestScore) {
      bestScore = score;
      bestMatch = match.category;
    }
  }

  // If we have a match with at least one keyword, return it
  if (bestMatch && bestScore > 0) {
    return bestMatch.originalType;
  }

  // Default fallback - try to match by any substring
  for (const rt of resourceTypes) {
    const keywords = rt.originalType.toLowerCase().split(/[\s\/&]+/);
    for (const keyword of keywords) {
      if (normalizedType.includes(keyword) || keyword.includes(normalizedType)) {
        return rt.originalType;
      }
    }
  }

  // If no match found, return null (will need manual assignment)
  return null;
}

/**
 * Gets the resource type category slug for a resource type string
 */
export function getCategorySlugForResourceType(resourceType: string | null | undefined): string | null {
  const mappedType = mapResourceTypeToCategory(resourceType);
  if (!mappedType) return null;
  
  const category = resourceTypes.find(rt => rt.originalType === mappedType);
  return category?.slug || null;
}

/**
 * Gets the ResourceType object for a resource type string
 */
export function getCategoryForResourceType(resourceType: string | null | undefined): ResourceType | null {
  const mappedType = mapResourceTypeToCategory(resourceType);
  if (!mappedType) return null;
  
  return resourceTypes.find(rt => rt.originalType === mappedType) || null;
}


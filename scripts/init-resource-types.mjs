import "dotenv/config";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("❌ Variables d'environnement Supabase manquantes");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const resourceTypes = [
  { name: "Mentorat / coaching", slug: "mentorat-coaching" },
  { name: "Incubation & accélération", slug: "incubation-acceleration" },
  { name: "Formation & développement de compétences", slug: "formation-competences" },
  { name: "Réseautage & communauté", slug: "reseautage-communaute" },
  { name: "Conseils techniques ou sectoriels", slug: "conseils-techniques" },
  { name: "Support administratif / réglementaire", slug: "support-administratif" },
  { name: "Support au marketing / commercialisation / accès au marché", slug: "marketing-commercialisation" },
  { name: "Support technologique / numérique", slug: "support-technologique" },
  { name: "Support thématique ou pour groupes sous-représentés", slug: "support-thematique" },
  { name: "Accès aux infrastructures ou ressources physiques", slug: "infrastructures" },
  { name: "Soutien à l'innovation et recherche/développement (R&D)", slug: "innovation-rd" },
  { name: "Soutien global de croissance & planification stratégique", slug: "croissance-strategie" },
];

async function initResourceTypes() {
  console.log("🔄 Initialisation des types de ressources...\n");

  // Check if table exists
  const { data: existingTypes, error: fetchError } = await supabase
    .from("resource_types")
    .select("id, name, slug");

  if (fetchError) {
    console.error("❌ Erreur lors de la vérification de la table:", fetchError.message);
    console.error("\n⚠️  La table 'resource_types' n'existe probablement pas.");
    console.error("   Exécutez d'abord la migration 0006_create_resource_types_relation.sql");
    process.exit(1);
  }

  console.log(`📊 Types existants dans la base: ${existingTypes?.length || 0}\n`);

  let inserted = 0;
  let skipped = 0;

  for (const type of resourceTypes) {
    // Check if type already exists
    const exists = existingTypes?.some(
      (t) => t.slug === type.slug || t.name === type.name
    );

    if (exists) {
      console.log(`⏭️  ${type.name} - déjà présent`);
      skipped++;
      continue;
    }

    // Insert the type
    const { data, error } = await supabase
      .from("resource_types")
      .insert({
        name: type.name,
        slug: type.slug,
      })
      .select("id")
      .single();

    if (error) {
      console.error(`❌ ${type.name} - erreur:`, error.message);
    } else {
      console.log(`✅ ${type.name} - inséré (ID: ${data.id})`);
      inserted++;
    }
  }

  console.log(`\n📈 Résumé:`);
  console.log(`   ✅ ${inserted} type(s) inséré(s)`);
  console.log(`   ⏭️  ${skipped} type(s) déjà présent(s)`);
  console.log(`   📊 Total: ${resourceTypes.length} type(s)\n`);
}

initResourceTypes().catch(console.error);


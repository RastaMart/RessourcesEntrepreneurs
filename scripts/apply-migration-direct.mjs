import "dotenv/config";
import { createClient } from "@supabase/supabase-js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
// Use service role key for admin operations, fallback to anon key
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("❌ Variables d'environnement Supabase manquantes");
  console.error("   NEXT_PUBLIC_SUPABASE_URL et SUPABASE_SERVICE_ROLE_KEY (ou NEXT_PUBLIC_SUPABASE_ANON_KEY) sont requis");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function applyMigration(migrationFile) {
  const migrationPath = path.join(__dirname, "..", "supabase", "migrations", migrationFile);
  
  if (!fs.existsSync(migrationPath)) {
    console.error(`❌ Fichier de migration introuvable: ${migrationPath}`);
    process.exit(1);
  }

  const sql = fs.readFileSync(migrationPath, "utf-8");
  
  console.log(`🔄 Application de la migration: ${migrationFile}\n`);
  
  // Since Supabase JS client doesn't support raw SQL execution,
  // we'll parse the SQL and execute statements that can be done via the client
  // For DDL statements, we'll provide instructions
  
  console.log("⚠️  Le client Supabase JS ne peut pas exécuter du SQL brut directement.");
  console.log("   Cette migration doit être exécutée via le Dashboard Supabase.\n");
  
  console.log("📋 SQL à exécuter dans le Dashboard Supabase → SQL Editor:\n");
  console.log("─".repeat(70));
  console.log(sql);
  console.log("─".repeat(70));
  console.log("\n📝 Instructions:");
  console.log("   1. Allez sur https://supabase.com/dashboard");
  console.log("   2. Sélectionnez votre projet");
  console.log("   3. Allez dans SQL Editor");
  console.log("   4. Collez le SQL ci-dessus");
  console.log("   5. Cliquez sur Run\n");
  
  // However, we can try to execute some operations that are possible via the client
  // For example, we can check if tables exist and insert data
  
  // Check if resource_types table exists by trying to query it
  const { data: types, error: typesError } = await supabase
    .from("resource_types")
    .select("id")
    .limit(1);
  
  if (typesError) {
    if (typesError.code === "PGRST116" || typesError.message.includes("does not exist")) {
      console.log("❌ La table 'resource_types' n'existe pas encore.");
      console.log("   Vous devez d'abord exécuter la migration SQL dans le Dashboard.\n");
    } else {
      console.log("ℹ️  Erreur lors de la vérification:", typesError.message);
    }
  } else {
    console.log("✅ La table 'resource_types' existe déjà.");
    
    // Try to insert types if they don't exist
    if (migrationFile.includes("0006")) {
      console.log("\n🔄 Vérification et insertion des types manquants...\n");
      
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

      let inserted = 0;
      let skipped = 0;

      for (const type of resourceTypes) {
        // Check if exists
        const { data: existing } = await supabase
          .from("resource_types")
          .select("id")
          .eq("slug", type.slug)
          .maybeSingle();

        if (existing) {
          console.log(`⏭️  ${type.name} - déjà présent`);
          skipped++;
          continue;
        }

        // Insert
        const { error: insertError } = await supabase
          .from("resource_types")
          .insert({
            name: type.name,
            slug: type.slug,
          });

        if (insertError) {
          console.error(`❌ ${type.name} - erreur:`, insertError.message);
        } else {
          console.log(`✅ ${type.name} - inséré`);
          inserted++;
        }
      }

      console.log(`\n📈 Résumé:`);
      console.log(`   ✅ ${inserted} type(s) inséré(s)`);
      console.log(`   ⏭️  ${skipped} type(s) déjà présent(s)\n`);
    }
  }
}

// Get migration file from command line args
const migrationFile = process.argv[2];

if (!migrationFile) {
  console.error("❌ Usage: node scripts/apply-migration-direct.mjs <migration-file>");
  console.error("   Exemple: node scripts/apply-migration-direct.mjs 0006_create_resource_types_relation.sql");
  console.error("\n   Ou utilisez: npm run init:types (pour initialiser uniquement les types)");
  process.exit(1);
}

applyMigration(migrationFile).catch(console.error);


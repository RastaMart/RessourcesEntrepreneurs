import "dotenv/config";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl) {
  console.error("❌ NEXT_PUBLIC_SUPABASE_URL manquant dans .env");
  process.exit(1);
}

if (!supabaseServiceKey) {
  console.error("❌ SUPABASE_SERVICE_ROLE_KEY manquant dans .env");
  console.error("   Vous pouvez le trouver dans: Dashboard Supabase → Settings → API → service_role key");
  process.exit(1);
}

async function applyMigration(migrationFile) {
  const migrationPath = path.join(__dirname, "..", "supabase", "migrations", migrationFile);
  
  if (!fs.existsSync(migrationPath)) {
    console.error(`❌ Fichier de migration introuvable: ${migrationPath}`);
    process.exit(1);
  }

  const sql = fs.readFileSync(migrationPath, "utf-8");
  
  console.log(`🔄 Application de la migration: ${migrationFile}\n`);
  console.log("📋 SQL à exécuter:\n");
  console.log("─".repeat(70));
  console.log(sql);
  console.log("─".repeat(70));
  console.log("\n");

  // Use Supabase Management API to execute SQL
  // Note: This requires the service_role key
  try {
    const response = await fetch(`${supabaseUrl}/rest/v1/rpc/exec_sql`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "apikey": supabaseServiceKey,
        "Authorization": `Bearer ${supabaseServiceKey}`,
      },
      body: JSON.stringify({ query: sql }),
    });

    if (response.ok) {
      console.log("✅ Migration exécutée avec succès!\n");
      return;
    }

    // If exec_sql doesn't exist, try alternative approach
    const errorText = await response.text();
    console.log("⚠️  La fonction exec_sql n'est pas disponible.");
    console.log("   Utilisation d'une approche alternative...\n");
  } catch (error) {
    console.log("⚠️  Impossible d'exécuter via API.");
    console.log("   Utilisation d'une approche alternative...\n");
  }

  // Alternative: Parse SQL and execute statements that can be done via client
  // For DDL, we'll provide manual instructions
  console.log("📝 Instructions pour exécuter la migration:\n");
  console.log("   1. Allez sur https://supabase.com/dashboard");
  console.log("   2. Sélectionnez votre projet");
  console.log("   3. Allez dans SQL Editor");
  console.log("   4. Collez le SQL ci-dessus");
  console.log("   5. Cliquez sur Run\n");
  
  // However, we can still try to insert data if tables exist
  const { createClient } = await import("@supabase/supabase-js");
  const supabase = createClient(supabaseUrl, supabaseServiceKey);

  // Check if resource_types table exists
  const { data: types, error: typesError } = await supabase
    .from("resource_types")
    .select("id")
    .limit(1);
  
  if (typesError) {
    if (typesError.code === "PGRST116" || typesError.message.includes("does not exist")) {
      console.log("❌ La table 'resource_types' n'existe pas encore.");
      console.log("   Vous devez d'abord exécuter la partie DDL du SQL dans le Dashboard.\n");
      console.log("   Exécutez cette partie d'abord:\n");
      console.log("─".repeat(70));
      const ddlPart = sql.split("-- Insert all resource types")[0];
      console.log(ddlPart);
      console.log("─".repeat(70));
      console.log("\n   Puis réessayez ce script pour insérer les données.\n");
    } else {
      console.log("ℹ️  Erreur lors de la vérification:", typesError.message);
    }
  } else {
    console.log("✅ La table 'resource_types' existe déjà.");
    
    // Insert types if migration file is 0006
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
  console.error("❌ Usage: node scripts/apply-migration-to-prod.mjs <migration-file>");
  console.error("   Exemple: node scripts/apply-migration-to-prod.mjs 0006_create_resource_types_relation.sql");
  process.exit(1);
}

applyMigration(migrationFile).catch(console.error);


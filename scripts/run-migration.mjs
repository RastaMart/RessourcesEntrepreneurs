import "dotenv/config";
import { createClient } from "@supabase/supabase-js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("❌ Variables d'environnement Supabase manquantes");
  console.error("   NEXT_PUBLIC_SUPABASE_URL et SUPABASE_SERVICE_ROLE_KEY (ou NEXT_PUBLIC_SUPABASE_ANON_KEY) sont requis");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function runMigration(migrationFile) {
  const migrationPath = path.join(__dirname, "..", "supabase", "migrations", migrationFile);
  
  if (!fs.existsSync(migrationPath)) {
    console.error(`❌ Fichier de migration introuvable: ${migrationPath}`);
    process.exit(1);
  }

  const sql = fs.readFileSync(migrationPath, "utf-8");
  
  console.log(`🔄 Exécution de la migration: ${migrationFile}\n`);
  console.log("SQL à exécuter:");
  console.log("─".repeat(60));
  console.log(sql);
  console.log("─".repeat(60));
  console.log("");

  // Split SQL into individual statements
  const statements = sql
    .split(";")
    .map(s => s.trim())
    .filter(s => s.length > 0 && !s.startsWith("--"));

  let successCount = 0;
  let errorCount = 0;

  for (let i = 0; i < statements.length; i++) {
    const statement = statements[i];
    
    // Skip empty statements
    if (!statement || statement.length < 10) continue;

    try {
      // Use RPC to execute SQL (if available) or use direct query
      // Note: Supabase client doesn't support raw SQL execution directly
      // We'll need to use the REST API or a different approach
      
      // For now, we'll use the REST API endpoint
      const response = await fetch(`${supabaseUrl}/rest/v1/rpc/exec_sql`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "apikey": supabaseKey,
          "Authorization": `Bearer ${supabaseKey}`,
        },
        body: JSON.stringify({ sql: statement }),
      });

      if (!response.ok) {
        // Try alternative: execute via PostgREST if exec_sql function exists
        // Otherwise, we'll need to parse and execute statements differently
        console.log(`⚠️  Statement ${i + 1} - Note: Some statements may need to be run manually`);
      } else {
        successCount++;
        console.log(`✅ Statement ${i + 1} executed`);
      }
    } catch (error) {
      errorCount++;
      console.error(`❌ Statement ${i + 1} failed:`, error.message);
    }
  }

  console.log(`\n📊 Résumé:`);
  console.log(`   ✅ ${successCount} statement(s) exécuté(s)`);
  console.log(`   ❌ ${errorCount} erreur(s)`);
  console.log(`\n⚠️  Note: Certaines migrations nécessitent des privilèges admin.`);
  console.log(`   Si des erreurs surviennent, exécutez le SQL manuellement dans le Dashboard Supabase.\n`);
}

// Get migration file from command line args
const migrationFile = process.argv[2];

if (!migrationFile) {
  console.error("❌ Usage: node scripts/run-migration.mjs <migration-file>");
  console.error("   Exemple: node scripts/run-migration.mjs 0006_create_resource_types_relation.sql");
  process.exit(1);
}

runMigration(migrationFile).catch(console.error);


#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import dotenv from 'dotenv';

// Load environment variables from .env.remote for production connection
const envRemotePath = path.join(process.cwd(), '.env.remote');
const envRemoteExists = fs.existsSync(envRemotePath);

if (!envRemoteExists) {
  console.error('❌ Error: .env.remote file not found.');
  console.error('   This script requires production Supabase credentials.');
  console.error('');
  console.error('   Create .env.remote with:');
  console.error('   - NEXT_PUBLIC_SUPABASE_URL');
  console.error('   - SUPABASE_SERVICE_ROLE_KEY');
  console.error('');
  console.error('   Or link your Supabase project:');
  console.error('   supabase link --project-ref your-project-ref');
  process.exit(1);
}

dotenv.config({ path: '.env.remote' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Error: Missing required environment variables in .env.remote:');
  console.error('   - NEXT_PUBLIC_SUPABASE_URL');
  console.error('   - SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

async function createMigrationFromProd() {
  try {
    console.log('📥 Fetching production database schema...');
    
    // Get the current date in YYYYMMDD format for migration prefix
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const datePrefix = `${year}${month}${day}`;
    
    // Find the next migration number for this date
    const migrationsDir = path.join(process.cwd(), 'supabase', 'migrations');
    const existingMigrations = fs.readdirSync(migrationsDir)
      .filter(file => file.endsWith('.sql') && file.startsWith(datePrefix))
      .sort();
    
    // Get the next sequence number for this date
    let sequenceNumber = 1;
    if (existingMigrations.length > 0) {
      const lastMigration = existingMigrations[existingMigrations.length - 1];
      // Extract sequence number from filename like: 20250117_001_description.sql
      const match = lastMigration.match(/^(\d{8})_(\d{3})_/);
      if (match) {
        sequenceNumber = parseInt(match[2]) + 1;
      }
    }
    
    const sequenceStr = String(sequenceNumber).padStart(3, '0');
    const migrationName = `${datePrefix}_${sequenceStr}_sync_from_prod.sql`;
    const migrationPath = path.join(migrationsDir, migrationName);
    
    // Create a temporary file for the schema dump
    const tempSchemaFile = path.join(process.cwd(), 'temp_prod_schema.sql');
    
    try {
      // Extract project ref from URL
      const projectRef = supabaseUrl.match(/https?:\/\/([^.]+)\.supabase\.co/)?.[1];
      
      if (!projectRef) {
        throw new Error('Could not extract project ref from Supabase URL');
      }
      
      console.log(`🔗 Project ref: ${projectRef}`);
      console.log('📤 Dumping schema from production...');
      
      // Check if project is linked by checking for .supabase directory
      const supabaseConfigPath = path.join(process.cwd(), '.supabase', 'config.toml');
      const isLinked = fs.existsSync(supabaseConfigPath);
      
      // Get database password from env or construct connection string
      const dbPassword = process.env.SUPABASE_DB_PASSWORD;
      const dbUrl = process.env.SUPABASE_DB_URL;
      
      let connectionString = null;
      
      if (isLinked) {
        // For linked projects, we need to get the connection string
        // Try to use Supabase CLI to get connection info, or use pg_dump directly
        console.log('   Using linked Supabase project...');
        // We'll need the database password even for linked projects
        if (dbPassword) {
          connectionString = `postgresql://postgres.${projectRef}:${encodeURIComponent(dbPassword)}@aws-0-${projectRef.split('-')[0]}.pooler.supabase.com:6543/postgres`;
        } else if (dbUrl) {
          connectionString = dbUrl;
        } else {
          throw new Error('For linked projects, you still need SUPABASE_DB_PASSWORD or SUPABASE_DB_URL in .env.remote');
        }
      } else if (dbUrl) {
        connectionString = dbUrl;
      } else if (dbPassword) {
        // Construct connection string from project ref and password
        connectionString = `postgresql://postgres.${projectRef}:${encodeURIComponent(dbPassword)}@aws-0-${projectRef.split('-')[0]}.pooler.supabase.com:6543/postgres`;
      } else {
        throw new Error('Missing database connection details. Set SUPABASE_DB_URL or SUPABASE_DB_PASSWORD in .env.remote, or link your project with: supabase link --project-ref ' + projectRef);
      }
      
      // Use pg_dump directly for schema-only dump
      console.log('   Dumping schema (no data)...');
      execSync(
        `pg_dump "${connectionString}" --schema-only --no-owner --no-acl -f ${tempSchemaFile}`,
        { stdio: 'inherit' }
      );
    } catch (dumpError) {
      console.error('❌ Error dumping schema from production.');
      console.error('');
      console.error('   Option 1: Link your Supabase project first:');
      console.error('   supabase link --project-ref your-project-ref');
      console.error('');
      console.error('   Option 2: Add database connection to .env.remote:');
      console.error('   SUPABASE_DB_URL=postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres');
      console.error('   Or:');
      console.error('   SUPABASE_DB_PASSWORD=your-database-password');
      console.error('');
      console.error('   You can find the connection string in:');
      console.error('   Supabase Dashboard > Project Settings > Database > Connection string');
      
      // Clean up temp file if it exists
      if (fs.existsSync(tempSchemaFile)) {
        fs.unlinkSync(tempSchemaFile);
      }
      process.exit(1);
    }
    
    // Read the dumped schema
    if (!fs.existsSync(tempSchemaFile)) {
      console.error('❌ Schema dump file was not created.');
      process.exit(1);
    }
    
    let schemaContent = fs.readFileSync(tempSchemaFile, 'utf8');
    
    // Clean up the schema content
    // Remove comments that might cause issues
    schemaContent = schemaContent
      .split('\n')
      .filter(line => {
        // Keep important lines, remove empty lines and some system comments
        return line.trim().length > 0;
      })
      .join('\n');
    
    // Add header comment
    const migrationContent = `-- Migration created from production database schema
-- Generated: ${now.toISOString()}
-- Source: Production Supabase database

${schemaContent}
`;
    
    // Write the migration file
    fs.writeFileSync(migrationPath, migrationContent);
    
    // Clean up temp file
    fs.unlinkSync(tempSchemaFile);
    
    console.log('✅ Migration file created successfully!');
    console.log(`📄 File: ${migrationPath}`);
    console.log('');
    console.log('⚠️  Important: Review the migration file before applying it.');
    console.log('   You may need to:');
    console.log('   1. Remove or adjust system-specific settings');
    console.log('   2. Ensure it matches your local database structure');
    console.log('   3. Test it on a development database first');
    console.log('');
    console.log('   To apply: supabase migration up');
    
  } catch (error) {
    console.error('❌ Error creating migration from production:', error);
    process.exit(1);
  }
}

createMigrationFromProd();


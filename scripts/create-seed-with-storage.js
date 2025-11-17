#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

async function createSeedWithStorage() {
  try {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupDir = path.join(process.cwd(), 'supabase', 'seeds', timestamp);
    if (!fs.existsSync(backupDir)) {
      fs.mkdirSync(backupDir, { recursive: true });
    }

    // Dump database data, excluding cron.job and storage.buckets
    console.log('🗄️  Dumping database data...');
    execSync(`supabase db dump -x cron.job -x storage.buckets -f ${backupDir}/seed.sql --data-only`, { stdio: 'inherit' });
    // Also update the main seed.sql for convenience
    fs.copyFileSync(`${backupDir}/seed.sql`, path.join(process.cwd(), 'supabase', 'seed.sql'));

    // Create storage seed in the backup folder
    console.log('📦 Creating storage seed data...');
    const storageSeedDir = path.join(backupDir, 'storage-seed');
    if (!fs.existsSync(storageSeedDir)) {
      fs.mkdirSync(storageSeedDir, { recursive: true });
    }
    // Use the existing create-storage-seed.js logic, but output to storageSeedDir
    // We'll require and call the function if possible, else fallback to copying
    // For now, copy the latest supabase/storage-seed to the backup
    const mainStorageSeedDir = path.join(process.cwd(), 'supabase', 'storage-seed');
    if (fs.existsSync(mainStorageSeedDir)) {
      fs.cpSync(mainStorageSeedDir, storageSeedDir, { recursive: true });
    }
    // Also update the main supabase/storage-seed as before (run the script)
    // This may fail if .env.remote is not configured, which is okay
    try {
      execSync('npm run createStorageSeed', { stdio: 'inherit' });
    } catch (storageError) {
      console.warn('⚠️  Warning: Storage seed creation was skipped or failed.');
      console.warn('   This is okay if you don\'t have .env.remote configured.');
      console.warn('   Database seed was created successfully.');
    }

    console.log('✅ Comprehensive seed backup created successfully!');
    console.log(`📁 Folder: ${backupDir}`);
    console.log(`📄 Includes: seed.sql + storage-seed/`);
  } catch (err) {
    console.error('❌ Error creating comprehensive seed:', err);
    process.exit(1);
  }
}

createSeedWithStorage(); 
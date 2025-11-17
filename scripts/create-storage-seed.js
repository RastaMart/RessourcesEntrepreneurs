#!/usr/bin/env node

import fs from 'fs';
import path from 'path';

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load environment variables from .env.remote for remote operations
const envRemotePath = path.join(process.cwd(), '.env.remote');
const envRemoteExists = fs.existsSync(envRemotePath);

if (!envRemoteExists) {
  console.warn('⚠️  Warning: .env.remote file not found.');
  console.warn('   Storage seed creation requires remote Supabase credentials.');
  console.warn('   Skipping storage seed creation.');
  console.warn('');
  console.warn('   To enable storage seeding, create .env.remote with:');
  console.warn('   - NEXT_PUBLIC_SUPABASE_URL');
  console.warn('   - SUPABASE_SERVICE_ROLE_KEY');
  process.exit(0);
}

dotenv.config({ path: '.env.remote' });

// Load environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.warn('⚠️  Warning: Missing required environment variables in .env.remote:');
  console.warn('   - NEXT_PUBLIC_SUPABASE_URL');
  console.warn('   - SUPABASE_SERVICE_ROLE_KEY');
  console.warn('');
  console.warn('   Skipping storage seed creation.');
  console.warn('   Please update .env.remote with your remote Supabase credentials to enable storage seeding.');
  process.exit(0);
}

// Create client with service role key to bypass RLS
const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function createStorageSeed() {
  try {
    console.log('📦 Creating storage seed data...');
    console.log(`🔑 Using service role key: ${supabaseServiceKey.substring(0, 10)}...`);

    // Get all buckets
    const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets();
    
    if (bucketsError) {
      console.error('❌ Error fetching buckets:', bucketsError);
      return;
    }

    console.log(`📦 Found ${buckets.length} buckets:`, buckets.map(b => b.name));

    // Get files from each bucket
    const storageData = {
      buckets: buckets,
      files: {}
    };

    for (const bucket of buckets) {
      console.log(`📁 Processing bucket: ${bucket.name}`);
      
      const { data: files, error: filesError } = await supabase.storage
        .from(bucket.name)
        .list('', { limit: 1000 });

      if (filesError) {
        console.error(`❌ Error fetching files from bucket ${bucket.name}:`, filesError);
        continue;
      }

      storageData.files[bucket.name] = files || [];
    }

    // Create storage seed directory
    const storageSeedDir = path.join(process.cwd(), 'supabase', 'storage-seed');
    if (!fs.existsSync(storageSeedDir)) {
      fs.mkdirSync(storageSeedDir, { recursive: true });
    }

    // Save storage metadata
    const metadataPath = path.join(storageSeedDir, 'storage-metadata.json');
    fs.writeFileSync(metadataPath, JSON.stringify(storageData, null, 2));

    // Download files for seeding
    console.log('📥 Downloading files for seeding...');
    let totalFilesDownloaded = 0;
    
    for (const bucket of buckets) {
      // Recursively list all files in the bucket
      async function listAllFiles(prefix = '') {
        const { data: items, error } = await supabase.storage
          .from(bucket.name)
          .list(prefix, { limit: 1000 });
        if (error) {
          console.warn(`⚠️  Warning: Could not list files in bucket ${bucket.name} at prefix '${prefix}':`, error);
          return [];
        }
        let files = [];
        for (const item of items) {
          if (item.id) {
            // It's a file
            files.push(prefix ? `${prefix}/${item.name}` : item.name);
          } else if (item.name) {
            // It's a folder, recurse
            const subFiles = await listAllFiles(prefix ? `${prefix}/${item.name}` : item.name);
            files = files.concat(subFiles);
          }
        }
        return files;
      }

      const allFiles = await listAllFiles();
      if (!allFiles || allFiles.length === 0) {
        console.log(`ℹ️  Bucket ${bucket.name} is empty, skipping file download`);
        continue;
      }
      console.log(`📁 Found ${allFiles.length} files in ${bucket.name}`);
      const bucketDir = path.join(storageSeedDir, bucket.name);
      if (!fs.existsSync(bucketDir)) {
        fs.mkdirSync(bucketDir, { recursive: true });
      }
      for (const filePath of allFiles) {
        try {
          console.log(`🔄 Attempting to download: ${bucket.name}/${filePath}`);
          const { data, error } = await supabase.storage
            .from(bucket.name)
            .download(filePath);
          if (error) {
            console.warn(`⚠️  Warning: Could not download ${filePath} from ${bucket.name}:`, error);
            continue;
          }
          const localFilePath = path.join(bucketDir, filePath);
          const dir = path.dirname(localFilePath);
          if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
          }
          const buffer = await data.arrayBuffer();
          fs.writeFileSync(localFilePath, Buffer.from(buffer));
          console.log(`✅ Downloaded: ${bucket.name}/${filePath}`);
          totalFilesDownloaded++;
        } catch (downloadError) {
          console.warn(`⚠️  Warning: Error downloading ${filePath} from ${bucket.name}:`, downloadError);
        }
      }
    }
    if (totalFilesDownloaded === 0) {
      console.log('ℹ️  No files were downloaded - all buckets appear to be empty');
    } else {
      console.log(`✅ Successfully downloaded ${totalFilesDownloaded} files`);
    }

    console.log('✅ Storage seed data created successfully!');
    console.log(`📁 Location: ${storageSeedDir}`);
    console.log(`📄 Metadata: ${metadataPath}`);

  } catch (error) {
    console.error('❌ Error creating storage seed:', error);
    process.exit(1);
  }
}

createStorageSeed(); 
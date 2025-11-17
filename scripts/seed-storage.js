#!/usr/bin/env node

import fs from 'fs';
import path from 'path';

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load environment variables from .env.local
dotenv.config({ path: '.env.local' });

// Load environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing required environment variables:');
  console.error('   - NEXT_PUBLIC_SUPABASE_URL');
  console.error('   - SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function seedStorage() {
  try {
    console.log('🌱 Seeding storage data...');

    const storageSeedDir = path.join(process.cwd(), 'supabase', 'storage-seed');
    const metadataPath = path.join(storageSeedDir, 'storage-metadata.json');

    if (!fs.existsSync(metadataPath)) {
      console.log('ℹ️  No storage seed data found. Skipping storage seeding.');
      return;
    }

    const storageData = JSON.parse(fs.readFileSync(metadataPath, 'utf8'));

    // Create buckets
    console.log('📦 Creating buckets...');
    for (const bucket of storageData.buckets) {
      try {
        const { error } = await supabase.storage.createBucket(bucket.name, {
          public: bucket.public || false,
          fileSizeLimit: bucket.file_size_limit,
          allowedMimeTypes: bucket.allowed_mime_types
        });

        if (error) {
          if (error.message.includes('already exists')) {
            console.log(`ℹ️  Bucket ${bucket.name} already exists, skipping...`);
          } else {
            console.warn(`⚠️  Warning: Could not create bucket ${bucket.name}:`, error.message);
          }
        } else {
          console.log(`✅ Created bucket: ${bucket.name}`);
        }
      } catch (bucketError) {
        console.warn(`⚠️  Warning: Error creating bucket ${bucket.name}:`, bucketError.message);
      }
    }

    // Upload files
    console.log('📤 Uploading files...');
    let totalUploaded = 0;
    
    // Recursively find all files in the storage-seed directory
    function findFiles(dir, bucketName) {
      const files = [];
      const items = fs.readdirSync(dir);
      
      for (const item of items) {
        const fullPath = path.join(dir, item);
        const stat = fs.statSync(fullPath);
        
        if (stat.isDirectory()) {
          // Recursively process subdirectories
          const subFiles = findFiles(fullPath, bucketName);
          files.push(...subFiles);
        } else if (stat.isFile()) {
          // Calculate the relative path from the bucket directory
          const bucketDir = path.join(storageSeedDir, bucketName);
          const relativePath = path.relative(bucketDir, fullPath);
          files.push({
            fullPath,
            relativePath,
            name: item,
            size: stat.size
          });
        }
      }
      
      return files;
    }
    
    for (const bucket of storageData.buckets) {
      const bucketDir = path.join(storageSeedDir, bucket.name);
      
      if (!fs.existsSync(bucketDir)) {
        console.log(`ℹ️  No files found for bucket ${bucket.name}, skipping...`);
        continue;
      }
      
      console.log(`📁 Processing bucket: ${bucket.name}`);
      const files = findFiles(bucketDir, bucket.name);
      
      if (files.length === 0) {
        console.log(`ℹ️  No files found in bucket ${bucket.name}, skipping...`);
        continue;
      }
      
      console.log(`📄 Found ${files.length} files in ${bucket.name}`);
      
      for (const file of files) {
        try {
          console.log(`🔄 Uploading: ${bucket.name}/${file.relativePath}`);
          const fileBuffer = fs.readFileSync(file.fullPath);
          
          // Determine content type based on file extension
          const ext = path.extname(file.name).toLowerCase();
          let contentType = 'application/octet-stream';
          
          if (ext === '.csv') contentType = 'text/csv';
          else if (ext === '.pdf') contentType = 'application/pdf';
          else if (ext === '.txt') contentType = 'text/plain';
          else if (ext === '.json') contentType = 'application/json';
          
          const { error } = await supabase.storage
            .from(bucket.name)
            .upload(file.relativePath, fileBuffer, {
              contentType: contentType,
              upsert: true
            });

          if (error) {
            console.warn(`⚠️  Warning: Could not upload ${file.relativePath} to ${bucket.name}:`, error.message);
          } else {
            console.log(`✅ Uploaded: ${bucket.name}/${file.relativePath} (${fileBuffer.length} bytes)`);
            totalUploaded++;
          }
        } catch (uploadError) {
          console.warn(`⚠️  Warning: Error uploading ${file.relativePath} to ${bucket.name}:`, uploadError.message);
        }
      }
    }

    console.log(`✅ Storage seeding completed successfully! Uploaded ${totalUploaded} files.`);

  } catch (error) {
    console.error('❌ Error seeding storage:', error);
    process.exit(1);
  }
}

seedStorage(); 
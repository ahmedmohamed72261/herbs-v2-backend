/**
 * ================================================================
 *  ORGANIC HERBS CO — Export Countries Seeder
 * ================================================================
 *
 *  This script reads flag & cover images from:
 *    - frontend/public/images/countries/  -> Export Countries
 *
 *  For each country:
 *    1. Uploads flag & cover images to Cloudinary
 *    2. Saves the ExportCountry record to MongoDB
 *
 *  Usage:
 *    node scripts/seedExportCountries.js
 *    node scripts/seedExportCountries.js --fresh
 *
 * ================================================================
 */

import mongoose from 'mongoose';
import dns from 'dns';
import dotenv from 'dotenv';
import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

import ExportCountry from '../src/models/ExportCountry.js';

dotenv.config({ path: './.env' });

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const FRONTEND_IMAGES = path.resolve(__dirname, '../../frontend/public/images');
const COUNTRIES_DIR = path.join(FRONTEND_IMAGES, 'countries');

const FRESH_SEED = process.argv.includes('--fresh');

// Map of filename stems to country data
const COUNTRY_MAP = [
  {
    stem: 'Brazil',
    name_en: 'Brazil',
    name_ar: 'البرازيل',
    code: 'BR',
    flagFile: 'Brazil.webp',
    coverFile: 'brazil-cover.jpg',
  },
  {
    stem: 'France',
    name_en: 'France',
    name_ar: 'فرنسا',
    code: 'FR',
    flagFile: 'France.webp',
    coverFile: 'france-cover.jpg',
  },
  {
    stem: 'India',
    name_en: 'India',
    name_ar: 'الهند',
    code: 'IN',
    flagFile: 'India.webp',
    coverFile: 'indian-cover.jpg',
  },
  {
    stem: 'South Africa',
    name_en: 'South Africa',
    name_ar: 'جنوب أفريقيا',
    code: 'ZA',
    flagFile: 'South Africa.webp',
    coverFile: 'south-africa-cover.webp',
  },
  {
    stem: 'U.K.',
    name_en: 'United Kingdom',
    name_ar: 'المملكة المتحدة',
    code: 'GB',
    flagFile: 'U.K..webp',
    coverFile: 'uk-cover.webp',
  },
  {
    stem: 'U.S.',
    name_en: 'United States',
    name_ar: 'الولايات المتحدة',
    code: 'US',
    flagFile: 'U.S..webp',
    coverFile: 'us-cover.jpg',
  },
];

function configureCloudinary() {
  const { CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET } = process.env;
  if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_API_KEY || !CLOUDINARY_API_SECRET) {
    throw new Error(
      'Missing Cloudinary credentials in .env.\n' +
      'Required: CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET'
    );
  }
  cloudinary.config({
    cloud_name: CLOUDINARY_CLOUD_NAME,
    api_key: CLOUDINARY_API_KEY,
    api_secret: CLOUDINARY_API_SECRET,
  });
  console.log(`☁️  Cloudinary configured for cloud: ${CLOUDINARY_CLOUD_NAME}`);
}

async function uploadToCloudinary(filePath, folder) {
  try {
    const result = await cloudinary.uploader.upload(filePath, {
      folder: `organic-herbs-co/${folder}`,
      use_filename: true,
      unique_filename: false,
      overwrite: true,
      quality: 'auto',
      fetch_format: 'auto',
    });
    return result.secure_url;
  } catch (err) {
    console.error(`   ✗ Cloudinary upload failed for ${filePath}: ${err.message}`);
    return null;
  }
}

async function seedExportCountries() {
  console.log('\n🌍 Seeding Export Countries...');

  if (!fs.existsSync(COUNTRIES_DIR)) {
    console.warn(`⚠️  Directory not found: ${COUNTRIES_DIR}`);
    return;
  }

  console.log(`   Found ${COUNTRY_MAP.length} countries defined.`);

  let created = 0;
  let skipped = 0;

  for (let i = 0; i < COUNTRY_MAP.length; i++) {
    const country = COUNTRY_MAP[i];

    const existing = await ExportCountry.findOne({ code: country.code });
    if (existing) {
      console.log(`   ↩ [${i + 1}/${COUNTRY_MAP.length}] Already exists: ${country.name_en} (${country.code})`);
      skipped++;
      continue;
    }

    // Upload flag image
    let flagUrl = null;
    const flagPath = path.join(COUNTRIES_DIR, country.flagFile);
    if (fs.existsSync(flagPath)) {
      process.stdout.write(`   ↑ [${i + 1}/${COUNTRY_MAP.length}] Uploading flag: ${country.flagFile}... `);
      flagUrl = await uploadToCloudinary(flagPath, 'countries/flags');
      console.log(flagUrl ? 'DONE' : 'FAILED');
    } else {
      console.log(`   ⚠️  [${i + 1}/${COUNTRY_MAP.length}] Flag not found: ${country.flagFile}`);
    }

    // Upload cover image
    let coverUrl = null;
    const coverPath = path.join(COUNTRIES_DIR, country.coverFile);
    if (fs.existsSync(coverPath)) {
      process.stdout.write(`   ↑ [${i + 1}/${COUNTRY_MAP.length}] Uploading cover: ${country.coverFile}... `);
      coverUrl = await uploadToCloudinary(coverPath, 'countries/covers');
      console.log(coverUrl ? 'DONE' : 'FAILED');
    } else {
      console.log(`   ⚠️  [${i + 1}/${COUNTRY_MAP.length}] Cover not found: ${country.coverFile}`);
    }

    await ExportCountry.create({
      name_en: country.name_en,
      name_ar: country.name_ar,
      code: country.code,
      flag: flagUrl,
      cover_image: coverUrl,
      description: '',
      display_order: i + 1,
      is_active: true,
    });

    created++;
    console.log(`   ✓ [${i + 1}/${COUNTRY_MAP.length}] Created: ${country.name_en} (${country.code})`);
  }

  console.log(`\n   ✅ Export Countries: ${created} created, ${skipped} skipped.`);
}

async function main() {
  console.log('');
  console.log('╔══════════════════════════════════════════════╗');
  console.log('║   ORGANIC HERBS CO — Export Countries Seeder  ║');
  console.log('╚══════════════════════════════════════════════╝');

  configureCloudinary();

  console.log('\n🔌 Connecting to MongoDB...');
  dns.setServers(['8.8.8.8', '1.1.1.1']);
  await mongoose.connect(process.env.MONGODB_URI);
  console.log(`   ✓ Connected: ${mongoose.connection.host}`);

  if (FRESH_SEED) {
    console.log('\n🗑️  --fresh flag detected. Clearing existing export countries...');
    await ExportCountry.deleteMany({});
    console.log('   ✓ All export countries removed.');
  }

  await seedExportCountries();

  console.log('\n');
  console.log('╔══════════════════════════════════════════════╗');
  console.log('║   ✅  Seeding Complete!                        ║');
  console.log('╚══════════════════════════════════════════════╝');
  console.log('');
}

main()
  .catch(err => {
    console.error('\n❌ Seeder failed:', err.message);
    if (err.stack) console.error(err.stack);
    process.exit(1);
  })
  .finally(async () => {
    await mongoose.connection.close();
    process.exit(0);
  });

/**
 * ================================================================
 *  ORGANIC HERBS CO — Full Data Seeder & Cloudinary Uploader
 * ================================================================
 *
 *  This script reads local images from:
 *    - frontend/public/images/product/   -> Products (Herbs, Seeds, Spices)
 *    - frontend/public/images/certificates/ -> Certificates
 *    - frontend/public/images/team/       -> Team Members
 *
 *  For each image:
 *    1. Uploads it to Cloudinary
 *    2. Saves the record to MongoDB with the secure Cloudinary URL
 *
 *  Usage:
 *    npm run seed          -> Append mode (safe, won't duplicate)
 *    npm run seed:fresh    -> Clear ALL existing data first, then seed
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

// --- Models ---
import Category from '../src/models/Category.js';
import Product from '../src/models/Product.js';
import Certificate from '../src/models/Certificate.js';
import TeamMember from '../src/models/TeamMember.js';

// --- Setup ---
dotenv.config({ path: './.env' });

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Path to the frontend's public/images folder (relative to this script)
const FRONTEND_IMAGES = path.resolve(__dirname, '../../frontend/public/images');

// Should we clear existing data before seeding?
const FRESH_SEED = process.argv.includes('--fresh');

// ----------------------------------------------------------------
//  Product Classification Map
//  Maps image filename (without extension, lowercase) to category
// ----------------------------------------------------------------
const CATEGORY_MAP = {
  // HERBS
  basil: 'Herbs',
  marjoram: 'Herbs',
  thyme: 'Herbs',
  parsley: 'Herbs',
  'dill-tips': 'Herbs',
  dill_weed: 'Herbs',
  rosemary: 'Herbs',
  sage: 'Herbs',
  spearmint: 'Herbs',
  melissa: 'Herbs',
  lemon_grass: 'Herbs',  // alias
  'lemon-grass': 'Herbs',
  nettle: 'Herbs',
  molokhia: 'Herbs',
  echnacia: 'Herbs',
  liquorice: 'Herbs',
  laurel: 'Herbs',

  // SEEDS
  anise: 'Seeds',
  caraway: 'Seeds',
  coriander: 'Seeds',
  fenugreek: 'Seeds',
  sesame: 'Seeds',
  fennel: 'Seeds',
  black_cumin: 'Seeds',
  nigella: 'Seeds',

  // SPICES
  cinnamon: 'Spices',
  ginger: 'Spices',
  garlic: 'Spices',
  onion: 'Spices',
  red_chilies: 'Spices',
  hibiscus: 'Spices',
  rose_petals: 'Spices',
};

// Arabic name map for products
const AR_NAMES = {
  'Anise': 'يانسون',
  'BASIL': 'ريحان',
  'Black Cumin': 'حبة البركة',
  'Caraway': 'كراوية',
  'Cinnamon': 'قرفة',
  'Coriander': 'كزبرة',
  'Dill Tips': 'شبت',
  'Dill Weed': 'شبت مجفف',
  'Echnacia': 'إشنسا',
  'Fennel': 'شمر',
  'Fenugreek': 'حلبة',
  'Garlic': 'ثوم',
  'Ginger': 'زنجبيل',
  'Hibiscus': 'كركديه',
  'Laurel': 'غار',
  'Lemon Grass': 'حشيشة الليمون',
  'Liquorice': 'عرق سوس',
  'Marjoram': 'مردقوش',
  'Melissa': 'ميليسا',
  'Molokhia': 'ملوخية',
  'Nettle': 'قراص',
  'Nigella': 'حبة السوداء',
  'Onion': 'بصل',
  'Parsley': 'بقدونس',
  'Red Chilies': 'فلفل أحمر',
  'Rose Petals': 'بتلات الورد',
  'Rosemary': 'إكليل الجبل',
  'Sage': 'مريمية',
  'Sesame': 'سمسم',
  'Spearmint': 'نعناع أخضر',
  'Thyme': 'زعتر',
};

// ----------------------------------------------------------------
//  Helper: Pretty name from filename
//  e.g. "Black_Cumin.jpg" → "Black Cumin"
//  e.g. "Dill-tips.jpg"  → "Dill Tips"
// ----------------------------------------------------------------
function prettifyName(filename) {
  const name = path.basename(filename, path.extname(filename));
  return name.replace(/[-_]/g, ' ').replace(/\b\w/g, c => c.toUpperCase()).trim();
}

// ----------------------------------------------------------------
//  Helper: Slug from name
// ----------------------------------------------------------------
function slugify(str) {
  return str.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '');
}

// ----------------------------------------------------------------
//  Helper: Read all image files in a directory
// ----------------------------------------------------------------
function getImages(dir) {
  if (!fs.existsSync(dir)) {
    console.warn(`⚠️  Directory not found: ${dir}`);
    return [];
  }
  return fs.readdirSync(dir).filter(f => /\.(jpg|jpeg|png|webp|gif)$/i.test(f));
}

// ----------------------------------------------------------------
//  Cloudinary Config
// ----------------------------------------------------------------
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

// ----------------------------------------------------------------
//  Upload a single image file to Cloudinary
//  Returns the secure_url of the uploaded asset
// ----------------------------------------------------------------
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

// ----------------------------------------------------------------
//  SEED: Categories
//  Creates Herbs, Seeds, Spices, Dried Flowers — returns a name→doc map
// ----------------------------------------------------------------
async function seedCategories() {
  console.log('\n📂 Seeding Categories...');

  const categoryDefs = [
    { name_en: 'Herbs',         name_ar: 'أعشاب',       slug: 'herbs',         order: 1 },
    { name_en: 'Seeds',         name_ar: 'بذور',         slug: 'seeds',         order: 2 },
    { name_en: 'Spices',        name_ar: 'بهارات',       slug: 'spices',        order: 3 },
    { name_en: 'Dried Flowers', name_ar: 'زهور مجففة',   slug: 'dried-flowers', order: 4 },
    { name_en: 'Botanicals',    name_ar: 'نباتات',       slug: 'botanicals',    order: 5 },
  ];

  const categoryMap = {};

  for (const cat of categoryDefs) {
    let doc = await Category.findOne({ slug: cat.slug });
    if (!doc) {
      doc = await Category.create(cat);
      console.log(`   ✓ Created category: ${cat.name_en}`);
    } else {
      console.log(`   ↩ Already exists: ${cat.name_en}`);
    }
    categoryMap[cat.name_en] = doc;
  }

  return categoryMap;
}

// ----------------------------------------------------------------
//  SEED: Products from frontend/public/images/product/
// ----------------------------------------------------------------
async function seedProducts(categoryMap) {
  console.log('\n🌿 Seeding Products...');

  const productDir = path.join(FRONTEND_IMAGES, 'product');
  const files = getImages(productDir);

  if (files.length === 0) {
    console.log('   ⚠️  No product images found.');
    return;
  }

  console.log(`   Found ${files.length} product images.`);

  let created = 0;
  let skipped = 0;

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const englishName = prettifyName(file);
    const slug = slugify(englishName);

    // Check if product already exists
    const existing = await Product.findOne({ slug });
    if (existing) {
      console.log(`   ↩ [${i + 1}/${files.length}] Already exists: ${englishName}`);
      skipped++;
      continue;
    }

    // Determine category
    const key = path.basename(file, path.extname(file)).toLowerCase();
    const categoryName = CATEGORY_MAP[key] || 'Botanicals';
    const categoryDoc = categoryMap[categoryName] || categoryMap['Botanicals'];

    // Upload to Cloudinary
    process.stdout.write(`   ↑ [${i + 1}/${files.length}] Uploading: ${file} → ${categoryName}... `);
    const filePath = path.join(productDir, file);
    const imageUrl = await uploadToCloudinary(filePath, 'products');

    if (!imageUrl) {
      console.log('FAILED');
      continue;
    }
    console.log('DONE');

    const arabicName = AR_NAMES[englishName] || englishName;

    // Build short descriptions
    const shortDescEn = `Premium export-grade ${englishName.toLowerCase()} sourced from Egypt's finest agricultural regions.`;
    const shortDescAr = `${arabicName} عالي الجودة يتم الحصول عليه من أفضل المناطق الزراعية في مصر.`;
    const descEn = `Our ${englishName} is carefully cultivated, harvested, and processed to meet strict international export standards. Available in bulk quantities with custom packaging options for food manufacturers, tea blenders, and cosmetic producers worldwide.`;
    const descAr = `${arabicName} لدينا يُزرع بعناية، ويُحصد ويُعالج ليلبي معايير التصدير الدولية الصارمة. متاح بكميات كبيرة مع خيارات تغليف مخصصة لمصنعي الأغذية وخلاطي الشاي ومنتجي مستحضرات التجميل في جميع أنحاء العالم.`;

    await Product.create({
      category_id: categoryDoc._id,
      name_en: englishName,
      name_ar: arabicName,
      slug,
      short_description_en: shortDescEn,
      short_description_ar: shortDescAr,
      description_en: descEn,
      description_ar: descAr,
      image: imageUrl,
      images: [],
      price: 0,
      sku: `OHC-${slug.toUpperCase().replace(/-/g, '')}`,
      is_active: true,
      is_featured: false,
      order: i + 1,
    });

    created++;
  }

  console.log(`\n   ✅ Products: ${created} created, ${skipped} skipped.`);
}

// ----------------------------------------------------------------
//  SEED: Certificates from frontend/public/images/certificates/
// ----------------------------------------------------------------
async function seedCertificates() {
  console.log('\n🏅 Seeding Certificates...');

  const certDir = path.join(FRONTEND_IMAGES, 'certificates');
  const files = getImages(certDir);

  if (files.length === 0) {
    console.log('   ⚠️  No certificate images found.');
    return;
  }

  console.log(`   Found ${files.length} certificate images.`);

  // Define meaningful cert names based on file order
  const certNames = [
    { en: 'HACCP Certification',  ar: 'شهادة HACCP',      issuer: 'SGS International' },
    { en: 'ISO 22000',            ar: 'ISO 22000',          issuer: 'Bureau Veritas' },
    { en: 'EU Organic Certificate', ar: 'شهادة عضوية الاتحاد الأوروبي', issuer: 'European Organic Certifiers' },
    { en: 'USDA Organic',         ar: 'عضوي USDA',          issuer: 'USDA Agricultural Marketing Service' },
    { en: 'FDA Registration',     ar: 'تسجيل إدارة الغذاء والدواء', issuer: 'US Food and Drug Administration' },
    { en: 'GMP Certification',    ar: 'شهادة GMP',           issuer: 'International GMP Certifiers' },
    { en: 'Quality Management ISO 9001', ar: 'إدارة الجودة ISO 9001', issuer: 'BSI Group' },
  ];

  let created = 0;
  let skipped = 0;

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const meta = certNames[i] || { en: `Certificate ${i + 1}`, ar: `شهادة ${i + 1}`, issuer: 'International Authority' };

    const existing = await Certificate.findOne({ title_en: meta.en });
    if (existing) {
      console.log(`   ↩ [${i + 1}/${files.length}] Already exists: ${meta.en}`);
      skipped++;
      continue;
    }

    process.stdout.write(`   ↑ [${i + 1}/${files.length}] Uploading: ${file} → ${meta.en}... `);
    const filePath = path.join(certDir, file);
    const imageUrl = await uploadToCloudinary(filePath, 'certificates');

    if (!imageUrl) {
      console.log('FAILED');
      continue;
    }
    console.log('DONE');

    await Certificate.create({
      title_en: meta.en,
      title_ar: meta.ar,
      description_en: `${meta.en} — validating Organic Herbs Co's commitment to international quality and food safety standards.`,
      description_ar: `${meta.ar} — يعكس التزام Organic Herbs Co بمعايير الجودة وسلامة الغذاء الدولية.`,
      image: imageUrl,
      issuer: meta.issuer,
      is_active: true,
      order: i + 1,
    });

    created++;
  }

  console.log(`\n   ✅ Certificates: ${created} created, ${skipped} skipped.`);
}

// ----------------------------------------------------------------
//  SEED: Team Members from frontend/public/images/team/
// ----------------------------------------------------------------
async function seedTeam() {
  console.log('\n👥 Seeding Team Members...');

  const teamDir = path.join(FRONTEND_IMAGES, 'team');
  const files = getImages(teamDir);

  if (files.length === 0) {
    console.log('   ⚠️  No team images found.');
    return;
  }

  console.log(`   Found ${files.length} team images.`);

  // Define team member details
  const teamData = [
    {
      name_en: 'Ahmed Hassan',
      name_ar: 'أحمد حسن',
      position_en: 'Chief Executive Officer',
      position_ar: 'الرئيس التنفيذي',
      bio_en: 'Ahmed has over 20 years of experience in the Egyptian agricultural export industry, driving Organic Herbs Co\'s global growth strategy.',
      bio_ar: 'يمتلك أحمد أكثر من 20 عامًا من الخبرة في صناعة التصدير الزراعي المصري، ويقود استراتيجية النمو العالمي لـ Organic Herbs Co.',
    },
    {
      name_en: 'Sara Mahmoud',
      name_ar: 'سارة محمود',
      position_en: 'Head of Quality Control',
      position_ar: 'رئيسة مراقبة الجودة',
      bio_en: 'Sara leads our quality assurance team, ensuring every product shipment meets HACCP, ISO, and international food safety requirements.',
      bio_ar: 'تقود سارة فريق ضمان الجودة لدينا، وتضمن أن كل شحنة منتج تلبي متطلبات HACCP وISO وسلامة الغذاء الدولية.',
    },
    {
      name_en: 'Omar Fathy',
      name_ar: 'عمر فتحي',
      position_en: 'Export Sales Manager',
      position_ar: 'مدير مبيعات التصدير',
      bio_en: 'Omar manages our international B2B client relationships across Europe, Asia, and North America, with expertise in bulk botanical commodities.',
      bio_ar: 'يدير عمر علاقاتنا مع عملاء B2B الدوليين في أوروبا وآسيا وأمريكا الشمالية، مع خبرة في السلع النباتية السائبة.',
    },
    {
      name_en: 'Nadia Youssef',
      name_ar: 'نادية يوسف',
      position_en: 'Agricultural Sourcing Director',
      position_ar: 'مديرة التوريد الزراعي',
      bio_en: 'Nadia oversees our network of 200+ Egyptian farm partners, ensuring sustainable cultivation practices and premium raw material quality.',
      bio_ar: 'تشرف نادية على شبكتنا التي تضم أكثر من 200 شريك مزرعة مصري، وتضمن ممارسات الزراعة المستدامة وجودة المواد الخام الممتازة.',
    },
  ];

  let created = 0;
  let skipped = 0;

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const member = teamData[i] || {
      name_en: `Team Member ${i + 1}`,
      name_ar: `عضو الفريق ${i + 1}`,
      position_en: 'Agricultural Specialist',
      position_ar: 'أخصائي زراعي',
      bio_en: 'A dedicated member of the Organic Herbs Co export team.',
      bio_ar: 'عضو متفانٍ في فريق تصدير Organic Herbs Co.',
    };

    const existing = await TeamMember.findOne({ name_en: member.name_en });
    if (existing) {
      console.log(`   ↩ [${i + 1}/${files.length}] Already exists: ${member.name_en}`);
      skipped++;
      continue;
    }

    process.stdout.write(`   ↑ [${i + 1}/${files.length}] Uploading: ${file} → ${member.name_en}... `);
    const filePath = path.join(teamDir, file);
    const imageUrl = await uploadToCloudinary(filePath, 'team');

    if (!imageUrl) {
      console.log('FAILED');
      continue;
    }
    console.log('DONE');

    await TeamMember.create({
      ...member,
      image: imageUrl,
      is_active: true,
      order: i + 1,
    });

    created++;
  }

  console.log(`\n   ✅ Team Members: ${created} created, ${skipped} skipped.`);
}

// ----------------------------------------------------------------
//  MAIN
// ----------------------------------------------------------------
async function main() {
  console.log('');
  console.log('╔══════════════════════════════════════════════╗');
  console.log('║   ORGANIC HERBS CO — Data Seeder              ║');
  console.log('╚══════════════════════════════════════════════╝');

  // Configure Cloudinary
  configureCloudinary();

  // Connect to MongoDB
  console.log('\n🔌 Connecting to MongoDB...');
  dns.setServers(['8.8.8.8', '1.1.1.1']);
  await mongoose.connect(process.env.MONGODB_URI);
  console.log(`   ✓ Connected: ${mongoose.connection.host}`);

  // If fresh seed requested, clear existing data
  if (FRESH_SEED) {
    console.log('\n🗑️  --fresh flag detected. Clearing existing data...');
    await Promise.all([
      Product.deleteMany({}),
      Category.deleteMany({}),
      Certificate.deleteMany({}),
      TeamMember.deleteMany({}),
    ]);
    console.log('   ✓ All products, categories, certificates, and team members removed.');
  }

  // Run seed functions in sequence
  const categoryMap = await seedCategories();
  await seedProducts(categoryMap);
  await seedCertificates();
  await seedTeam();

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

/**
 * ================================================================
 *  ORGANIC HERBS CO — Product Details Seeder
 * ================================================================
 *
 *  Updates existing products with rich specification data:
 *    Origin, Form, Color, Purity, Moisture, Packaging,
 *    Shelf Life, Certifications, Export Availability
 *
 *  Usage:
 *    node scripts/seedProductDetails.js
 *    node scripts/seedProductDetails.js --fresh
 *
 * ================================================================
 */

import mongoose from 'mongoose';
import dns from 'dns';
import dotenv from 'dotenv';

import Product from '../src/models/Product.js';

dotenv.config({ path: './.env' });

const FRESH_SEED = process.argv.includes('--fresh');

// Product detail data mapped by slug/key
const PRODUCT_DETAILS = [
  // ========== HERBS ==========
  {
    slugs: ['basil'],
    origin: 'Egypt',
    form: 'Whole / Cut / TBC / Powder',
    color: 'Natural Green',
    purity: '99% Min',
    moisture: '12% Max',
    packaging: 'Customized Export Packaging',
    shelf_life: '24 Months',
    certifications: ['ISO 22000', 'HACCP', 'Organic EU', 'NOP', 'FSSC 22000', 'FDA'],
    export_availability: 'Worldwide',
  },
  {
    slugs: ['marjoram'],
    origin: 'Egypt',
    form: 'Whole / Cut / TBC / Powder',
    color: 'Greyish Green',
    purity: '99% Min',
    moisture: '12% Max',
    packaging: 'Customized Export Packaging',
    shelf_life: '24 Months',
    certifications: ['ISO 22000', 'HACCP', 'Organic EU', 'NOP', 'FSSC 22000', 'FDA'],
    export_availability: 'Worldwide',
  },
  {
    slugs: ['thyme'],
    origin: 'Egypt',
    form: 'Whole / Cut / TBC / Powder',
    color: 'Green',
    purity: '99% Min',
    moisture: '12% Max',
    packaging: 'Customized Export Packaging',
    shelf_life: '24 Months',
    certifications: ['ISO 22000', 'HACCP', 'Organic EU', 'NOP', 'FSSC 22000', 'FDA'],
    export_availability: 'Worldwide',
  },
  {
    slugs: ['parsley'],
    origin: 'Egypt',
    form: 'Flakes / Cut / Powder',
    color: 'Green',
    purity: '99% Min',
    moisture: '12% Max',
    packaging: 'Customized Export Packaging',
    shelf_life: '24 Months',
    certifications: ['ISO 22000', 'HACCP', 'Organic EU', 'NOP', 'FSSC 22000', 'FDA'],
    export_availability: 'Worldwide',
  },
  {
    slugs: ['dill-tips', 'dill-tip', 'dill weed', 'dill_weed', 'dill'],
    origin: 'Egypt',
    form: 'Whole / Cut / Flakes',
    color: 'Green',
    purity: '99% Min',
    moisture: '12% Max',
    packaging: 'Customized Export Packaging',
    shelf_life: '24 Months',
    certifications: ['ISO 22000', 'HACCP', 'Organic EU', 'NOP', 'FSSC 22000', 'FDA'],
    export_availability: 'Worldwide',
  },
  {
    slugs: ['rosemary'],
    origin: 'Egypt',
    form: 'Whole / Cut / TBC / Powder',
    color: 'Green',
    purity: '99% Min',
    moisture: '12% Max',
    packaging: 'Customized Export Packaging',
    shelf_life: '24 Months',
    certifications: ['ISO 22000', 'HACCP', 'Organic EU', 'NOP', 'FSSC 22000', 'FDA'],
    export_availability: 'Worldwide',
  },
  {
    slugs: ['sage'],
    origin: 'Egypt',
    form: 'Whole / Cut / TBC / Powder',
    color: 'Greyish Green',
    purity: '99% Min',
    moisture: '12% Max',
    packaging: 'Customized Export Packaging',
    shelf_life: '24 Months',
    certifications: ['ISO 22000', 'HACCP', 'Organic EU', 'NOP', 'FSSC 22000', 'FDA'],
    export_availability: 'Worldwide',
  },
  {
    slugs: ['spearmint'],
    origin: 'Egypt',
    form: 'Whole / Cut / TBC / Powder',
    color: 'Green',
    purity: '99% Min',
    moisture: '12% Max',
    packaging: 'Customized Export Packaging',
    shelf_life: '24 Months',
    certifications: ['ISO 22000', 'HACCP', 'Organic EU', 'NOP', 'FSSC 22000', 'FDA'],
    export_availability: 'Worldwide',
  },
  {
    slugs: ['melissa'],
    origin: 'Egypt',
    form: 'Whole / Cut / TBC',
    color: 'Green',
    purity: '99% Min',
    moisture: '12% Max',
    packaging: 'Customized Export Packaging',
    shelf_life: '24 Months',
    certifications: ['ISO 22000', 'HACCP', 'Organic EU', 'NOP', 'FSSC 22000', 'FDA'],
    export_availability: 'Worldwide',
  },
  {
    slugs: ['lemon grass', 'lemon_grass', 'lemon-grass'],
    origin: 'Egypt',
    form: 'Cut / TBC / Powder',
    color: 'Greenish Yellow',
    purity: '99% Min',
    moisture: '12% Max',
    packaging: 'Customized Export Packaging',
    shelf_life: '24 Months',
    certifications: ['ISO 22000', 'HACCP', 'Organic EU', 'NOP', 'FSSC 22000', 'FDA'],
    export_availability: 'Worldwide',
  },
  {
    slugs: ['nettle'],
    origin: 'Egypt',
    form: 'Whole / Cut / Powder',
    color: 'Dark Green',
    purity: '99% Min',
    moisture: '12% Max',
    packaging: 'Customized Export Packaging',
    shelf_life: '24 Months',
    certifications: ['ISO 22000', 'HACCP', 'Organic EU', 'NOP', 'FSSC 22000', 'FDA'],
    export_availability: 'Worldwide',
  },
  {
    slugs: ['molokhia'],
    origin: 'Egypt',
    form: 'Leaves / Ground / Cut',
    color: 'Green',
    purity: '99% Min',
    moisture: '12% Max',
    packaging: 'Customized Export Packaging',
    shelf_life: '24 Months',
    certifications: ['ISO 22000', 'HACCP', 'Organic EU', 'NOP', 'FSSC 22000', 'FDA'],
    export_availability: 'Worldwide',
  },
  {
    slugs: ['echnacia', 'echinacea'],
    origin: 'Egypt',
    form: 'Whole / Cut / Powder',
    color: 'Brownish Green',
    purity: '98% Min',
    moisture: '12% Max',
    packaging: 'Customized Export Packaging',
    shelf_life: '24 Months',
    certifications: ['ISO 22000', 'HACCP', 'Organic EU', 'NOP', 'FSSC 22000', 'FDA'],
    export_availability: 'Worldwide',
  },
  {
    slugs: ['liquorice'],
    origin: 'Egypt',
    form: 'Root / Cut / Powder',
    color: 'Brown',
    purity: '98% Min',
    moisture: '12% Max',
    packaging: 'Customized Export Packaging',
    shelf_life: '36 Months',
    certifications: ['ISO 22000', 'HACCP', 'Organic EU', 'NOP', 'FSSC 22000', 'FDA'],
    export_availability: 'Worldwide',
  },
  {
    slugs: ['laurel'],
    origin: 'Egypt',
    form: 'Whole / Cut / TBC / Powder',
    color: 'Green',
    purity: '99% Min',
    moisture: '12% Max',
    packaging: 'Customized Export Packaging',
    shelf_life: '24 Months',
    certifications: ['ISO 22000', 'HACCP', 'Organic EU', 'NOP', 'FSSC 22000', 'FDA'],
    export_availability: 'Worldwide',
  },
  // ========== SEEDS ==========
  {
    slugs: ['anise'],
    origin: 'Egypt',
    form: 'Whole / Ground',
    color: 'Brownish Grey',
    purity: '99% Min',
    moisture: '10% Max',
    packaging: 'Customized Export Packaging',
    shelf_life: '24 Months',
    certifications: ['ISO 22000', 'HACCP', 'Organic EU', 'NOP', 'FSSC 22000', 'FDA'],
    export_availability: 'Worldwide',
  },
  {
    slugs: ['caraway'],
    origin: 'Egypt',
    form: 'Whole / Ground',
    color: 'Dark Brown',
    purity: '99% Min',
    moisture: '10% Max',
    packaging: 'Customized Export Packaging',
    shelf_life: '24 Months',
    certifications: ['ISO 22000', 'HACCP', 'Organic EU', 'NOP', 'FSSC 22000', 'FDA'],
    export_availability: 'Worldwide',
  },
  {
    slugs: ['coriander'],
    origin: 'Egypt',
    form: 'Whole / Ground',
    color: 'Light Brown',
    purity: '99% Min',
    moisture: '10% Max',
    packaging: 'Customized Export Packaging',
    shelf_life: '24 Months',
    certifications: ['ISO 22000', 'HACCP', 'Organic EU', 'NOP', 'FSSC 22000', 'FDA'],
    export_availability: 'Worldwide',
  },
  {
    slugs: ['fenugreek'],
    origin: 'Egypt',
    form: 'Whole / Ground / Sprouted',
    color: 'Golden Yellow',
    purity: '99% Min',
    moisture: '10% Max',
    packaging: 'Customized Export Packaging',
    shelf_life: '24 Months',
    certifications: ['ISO 22000', 'HACCP', 'Organic EU', 'NOP', 'FSSC 22000', 'FDA'],
    export_availability: 'Worldwide',
  },
  {
    slugs: ['sesame'],
    origin: 'Egypt',
    form: 'Hulled / Unhulled / Toasted',
    color: 'Cream White / Brown',
    purity: '99% Min',
    moisture: '6% Max',
    packaging: 'Customized Export Packaging',
    shelf_life: '12 Months',
    certifications: ['ISO 22000', 'HACCP', 'Organic EU', 'NOP', 'FSSC 22000', 'FDA'],
    export_availability: 'Worldwide',
  },
  {
    slugs: ['fennel'],
    origin: 'Egypt',
    form: 'Whole / Ground',
    color: 'Pale Greenish Brown',
    purity: '99% Min',
    moisture: '10% Max',
    packaging: 'Customized Export Packaging',
    shelf_life: '24 Months',
    certifications: ['ISO 22000', 'HACCP', 'Organic EU', 'NOP', 'FSSC 22000', 'FDA'],
    export_availability: 'Worldwide',
  },
  {
    slugs: ['black cumin', 'black_cumin', 'nigella'],
    origin: 'Egypt',
    form: 'Whole / Ground / Oil',
    color: 'Black',
    purity: '99% Min',
    moisture: '8% Max',
    packaging: 'Customized Export Packaging',
    shelf_life: '24 Months',
    certifications: ['ISO 22000', 'HACCP', 'Organic EU', 'NOP', 'FSSC 22000', 'FDA'],
    export_availability: 'Worldwide',
  },
  // ========== SPICES ==========
  {
    slugs: ['cinnamon'],
    origin: 'Egypt',
    form: 'Sticks / Quills / Ground',
    color: 'Reddish Brown',
    purity: '99% Min',
    moisture: '12% Max',
    packaging: 'Customized Export Packaging',
    shelf_life: '24 Months',
    certifications: ['ISO 22000', 'HACCP', 'Organic EU', 'NOP', 'FSSC 22000', 'FDA'],
    export_availability: 'Worldwide',
  },
  {
    slugs: ['ginger'],
    origin: 'Egypt',
    form: 'Whole / Sliced / Ground',
    color: 'Pale Yellow',
    purity: '99% Min',
    moisture: '10% Max',
    packaging: 'Customized Export Packaging',
    shelf_life: '24 Months',
    certifications: ['ISO 22000', 'HACCP', 'Organic EU', 'NOP', 'FSSC 22000', 'FDA'],
    export_availability: 'Worldwide',
  },
  {
    slugs: ['garlic'],
    origin: 'Egypt',
    form: 'Granules / Powder / Minced / Flakes',
    color: 'Cream White',
    purity: '99% Min',
    moisture: '8% Max',
    packaging: 'Customized Export Packaging',
    shelf_life: '24 Months',
    certifications: ['ISO 22000', 'HACCP', 'Organic EU', 'NOP', 'FSSC 22000', 'FDA'],
    export_availability: 'Worldwide',
  },
  {
    slugs: ['onion'],
    origin: 'Egypt',
    form: 'Granules / Powder / Minced / Flakes',
    color: 'Cream White',
    purity: '99% Min',
    moisture: '8% Max',
    packaging: 'Customized Export Packaging',
    shelf_life: '24 Months',
    certifications: ['ISO 22000', 'HACCP', 'Organic EU', 'NOP', 'FSSC 22000', 'FDA'],
    export_availability: 'Worldwide',
  },
  {
    slugs: ['red chilies', 'red_chilies', 'red chili'],
    origin: 'Egypt',
    form: 'Whole / Crushed / Powder',
    color: 'Red',
    purity: '99% Min',
    moisture: '10% Max',
    packaging: 'Customized Export Packaging',
    shelf_life: '24 Months',
    certifications: ['ISO 22000', 'HACCP', 'Organic EU', 'NOP', 'FSSC 22000', 'FDA'],
    export_availability: 'Worldwide',
  },
  {
    slugs: ['hibiscus'],
    origin: 'Egypt',
    form: 'Whole / Cut / Powder',
    color: 'Dark Red',
    purity: '99% Min',
    moisture: '10% Max',
    packaging: 'Customized Export Packaging',
    shelf_life: '24 Months',
    certifications: ['ISO 22000', 'HACCP', 'Organic EU', 'NOP', 'FSSC 22000', 'FDA'],
    export_availability: 'Worldwide',
  },
  {
    slugs: ['rose petals', 'rose_petals'],
    origin: 'Egypt',
    form: 'Whole / Crushed / Powder',
    color: 'Pink / Red',
    purity: '99% Min',
    moisture: '10% Max',
    packaging: 'Customized Export Packaging',
    shelf_life: '24 Months',
    certifications: ['ISO 22000', 'HACCP', 'Organic EU', 'NOP', 'FSSC 22000', 'FDA'],
    export_availability: 'Worldwide',
  },
];

function matchSlug(productSlug, candidates) {
  return candidates.some(candidate =>
    productSlug.includes(candidate) || candidate.includes(productSlug)
  );
}

async function seedProductDetails() {
  console.log('\n📝 Seeding Product Details...');

  const products = await Product.find({});
  console.log(`   Found ${products.length} products in database.`);

  let updated = 0;
  let skipped = 0;

  for (let i = 0; i < products.length; i++) {
    const product = products[i];
    const slug = product.slug?.toLowerCase() || '';
    const name = product.name_en?.toLowerCase() || '';

    // Find matching detail data
    let match = null;
    for (const detail of PRODUCT_DETAILS) {
      if (matchSlug(slug, detail.slugs) || matchSlug(name, detail.slugs)) {
        match = detail;
        break;
      }
    }

    if (!match) {
      // Use generic defaults
      const categorySlug = product.category_id?.toString() || '';
      const isSeed = slug.includes('seed') || ['anise','caraway','coriander','fenugreek','sesame','fennel','cumin','nigella'].some(s => slug.includes(s) || name.includes(s));

      match = {
        origin: 'Egypt',
        form: isSeed ? 'Whole / Ground' : 'Whole / Cut / TBC / Powder',
        color: 'Natural',
        purity: '99% Min',
        moisture: isSeed ? '10% Max' : '12% Max',
        packaging: 'Customized Export Packaging',
        shelf_life: '24 Months',
        certifications: ['ISO 22000', 'HACCP', 'Organic EU', 'NOP', 'FSSC 22000', 'FDA'],
        export_availability: 'Worldwide',
      };
    }

    product.origin = match.origin;
    product.form = match.form;
    product.color = match.color;
    product.purity = match.purity;
    product.moisture = match.moisture;
    product.packaging = match.packaging;
    product.shelf_life = match.shelf_life;
    product.certifications = match.certifications;
    product.export_availability = match.export_availability;

    await product.save();
    updated++;
    process.stdout.write(`   ✓ [${i + 1}/${products.length}] ${product.name_en}\n`);
  }

  console.log(`\n   ✅ Product Details: ${updated} updated, ${skipped} skipped.`);
}

async function main() {
  console.log('');
  console.log('╔══════════════════════════════════════════════╗');
  console.log('║   ORGANIC HERBS CO — Product Details Seeder   ║');
  console.log('╚══════════════════════════════════════════════╝');

  console.log('\n🔌 Connecting to MongoDB...');
  dns.setServers(['8.8.8.8', '1.1.1.1']);
  await mongoose.connect(process.env.MONGODB_URI);
  console.log(`   ✓ Connected: ${mongoose.connection.host}`);

  if (FRESH_SEED) {
    console.log('\n🗑️  --fresh flag detected. Clearing product details...');
    await Product.updateMany({}, {
      $unset: {
        origin: '',
        form: '',
        color: '',
        purity: '',
        moisture: '',
        packaging: '',
        shelf_life: '',
        certifications: '',
        export_availability: '',
      },
    });
    console.log('   ✓ Product details cleared.');
  }

  await seedProductDetails();

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

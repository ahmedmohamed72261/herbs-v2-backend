import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  category_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
  },
  name_en: {
    type: String,
    required: true,
    trim: true,
  },
  name_ar: {
    type: String,
    required: true,
    trim: true,
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  description_en: {
    type: String,
    trim: true,
  },
  description_ar: {
    type: String,
    trim: true,
  },
  short_description_en: {
    type: String,
    trim: true,
  },
  short_description_ar: {
    type: String,
    trim: true,
  },
  image: {
    type: String,
  },
  images: {
    type: [String],
    default: [],
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
  sku: {
    type: String,
    trim: true,
  },
  stock: {
    type: Number,
    default: 0,
  },
  is_active: {
    type: Boolean,
    default: true,
  },
  is_featured: {
    type: Boolean,
    default: false,
  },
  order: {
    type: Number,
    default: 0,
  },
  meta_title_en: {
    type: String,
    trim: true,
  },
  meta_title_ar: {
    type: String,
    trim: true,
  },
  meta_description_en: {
    type: String,
    trim: true,
  },
  meta_description_ar: {
    type: String,
    trim: true,
  },
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
});

productSchema.virtual('category', {
  ref: 'Category',
  localField: 'category_id',
  foreignField: '_id',
  justOne: true
});

const Product = mongoose.model('Product', productSchema);

export default Product;

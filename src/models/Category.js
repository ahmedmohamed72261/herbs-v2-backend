import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema({
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
  image: {
    type: String,
  },
  is_active: {
    type: Boolean,
    default: true,
  },
  order: {
    type: Number,
    default: 0,
  },
}, {
  timestamps: true,
});

const Category = mongoose.model('Category', categorySchema);

export default Category;

import mongoose from 'mongoose';

const catalogSchema = new mongoose.Schema({
  title_en: {
    type: String,
    required: true,
    trim: true,
  },
  title_ar: {
    type: String,
    required: true,
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
  file: {
    type: String,
  },
  image: {
    type: String,
  },
  version: {
    type: String,
    trim: true,
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

const Catalog = mongoose.model('Catalog', catalogSchema);

export default Catalog;

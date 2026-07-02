import mongoose from 'mongoose';

const exportCountrySchema = new mongoose.Schema({
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
  code: {
    type: String,
    required: true,
    trim: true,
    uppercase: true,
  },
  flag: {
    type: String,
  },
  cover_image: {
    type: String,
  },
  description: {
    type: String,
    trim: true,
  },
  display_order: {
    type: Number,
    default: 0,
  },
  is_active: {
    type: Boolean,
    default: true,
  },
}, {
  timestamps: true,
});

const ExportCountry = mongoose.model('ExportCountry', exportCountrySchema);

export default ExportCountry;
import mongoose from 'mongoose';

const certificateSchema = new mongoose.Schema({
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
  image: {
    type: String,
  },
  file: {
    type: String,
  },
  issued_date: {
    type: Date,
  },
  expiry_date: {
    type: Date,
  },
  issuer: {
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

const Certificate = mongoose.model('Certificate', certificateSchema);

export default Certificate;

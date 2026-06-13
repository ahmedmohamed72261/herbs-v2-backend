import mongoose from 'mongoose';

const teamMemberSchema = new mongoose.Schema({
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
  position_en: {
    type: String,
    trim: true,
  },
  position_ar: {
    type: String,
    trim: true,
  },
  bio_en: {
    type: String,
    trim: true,
  },
  bio_ar: {
    type: String,
    trim: true,
  },
  image: {
    type: String,
  },
  linkedin: {
    type: String,
    trim: true,
  },
  email: {
    type: String,
    trim: true,
    lowercase: true,
  },
  phone: {
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

const TeamMember = mongoose.model('TeamMember', teamMemberSchema);

export default TeamMember;

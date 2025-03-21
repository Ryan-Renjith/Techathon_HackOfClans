import mongoose from 'mongoose';
import { ProfileDocument } from '../types';

const profileSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  bio: String,
  skills: [{
    type: String
  }],
  experience: String,
  education: String,
  contactInfo: {
    phone: String,
    address: String,
    linkedin: String
  }
}, {
  timestamps: true
});

export default mongoose.model<ProfileDocument>('Profile', profileSchema);
import mongoose from 'mongoose';
import { JobApplicationDocument } from '../types';

const jobApplicationSchema = new mongoose.Schema({
  jobId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'JobListing',
    required: true
  },
  applicantId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  resumeUrl: {
    type: String,
    required: true
  },
  resumePublicId: {
    type: String,
    required: true
  },
  coverLetter: String,
  status: {
    type: String,
    enum: ['pending', 'reviewed', 'accepted', 'rejected'],
    default: 'pending'
  }
}, {
  timestamps: true
});

// Middleware to delete resume from Cloudinary when application is deleted
jobApplicationSchema.pre('remove', async function(next) {
  try {
    const application = this as JobApplicationDocument;
    if (application.resumePublicId) {
      const { deleteFile } = require('../config/upload');
      await deleteFile(application.resumePublicId);
    }
    next();
  } catch (error) {
    next(error as Error);
  }
});

export default mongoose.model<JobApplicationDocument>('JobApplication', jobApplicationSchema);
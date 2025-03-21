import mongoose from 'mongoose';
import { JobListingDocument } from '../types';

const jobListingSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  company: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  requirements: [{
    type: String
  }],
  salaryRange: String,
  location: {
    type: String,
    required: true
  },
  employerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    enum: ['open', 'closed'],
    default: 'open'
  }
}, {
  timestamps: true
});

export default mongoose.model<JobListingDocument>('JobListing', jobListingSchema);
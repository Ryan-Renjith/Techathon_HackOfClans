import { Document } from 'mongoose';

export interface UserDocument extends Document {
  email: string;
  password: string;
  fullName: string;
  role: 'employer' | 'jobseeker';
  comparePassword(candidatePassword: string): Promise<boolean>;
}

export interface JobListingDocument extends Document {
  title: string;
  company: string;
  description: string;
  requirements: string[];
  salaryRange: string;
  location: string;
  employerId: string;
  status: 'open' | 'closed';
}

export interface JobApplicationDocument extends Document {
  jobId: string;
  applicantId: string;
  resumeUrl: string;
  resumePublicId: string;
  coverLetter?: string;
  status: 'pending' | 'reviewed' | 'accepted' | 'rejected';
}

export interface ProfileDocument extends Document {
  userId: string;
  bio?: string;
  skills: string[];
  experience?: string;
  education?: string;
  contactInfo: {
    phone?: string;
    address?: string;
    linkedin?: string;
  };
}

export * from './error';
export * from './auth';
export interface User {
  _id: string;
  email: string;
  fullName: string;
  role: 'employer' | 'jobseeker';
  createdAt: string;
}

export interface JobListing {
  _id: string;
  title: string;
  company: string;
  description: string;
  requirements: string[];
  salaryRange: string;
  location: string;
  employerId: string;
  createdAt: string;
  status: 'open' | 'closed';
}

export interface JobApplication {
  _id: string;
  jobId: JobListing;
  applicantId: User;
  resumeUrl: string;
  resumePublicId: string;
  coverLetter?: string;
  status: 'pending' | 'reviewed' | 'accepted' | 'rejected';
  createdAt: string;
}

export interface Profile {
  _id: string;
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
  createdAt: string;
  updatedAt: string;
}
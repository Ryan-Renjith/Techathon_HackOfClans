import 'express';
import { Multer } from 'multer';
import { UserDocument, JobListingDocument, JobApplicationDocument } from '../index';

declare global {
  namespace Express {
    interface Request {
      userId?: string;
      userRole?: 'employer' | 'jobseeker';
      file?: Multer.File & {
        path: string;
        filename: string;
        public_id: string;
      };
      user?: UserDocument;
      job?: JobListingDocument;
      application?: JobApplicationDocument;
    }
  }
}

export {};
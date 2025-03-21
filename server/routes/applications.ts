import express, { Response, Request } from 'express';
import { auth, checkRole } from '../middleware/auth';
import JobApplication from '../models/JobApplication';
import JobListing from '../models/JobListing';
import User from '../models/User';
import { upload, deleteFile } from '../config/upload';
import {
  sendApplicationNotification,
  sendApplicationStatusUpdate,
} from '../config/email';
import { JobApplicationDocument, UserDocument, JobListingDocument } from '../types';

const router = express.Router();

router.get('/', [auth, checkRole(['jobseeker'])], async (req: Request, res: Response) => {
  try {
    if (!req.userId) {
      return res.status(401).json({ message: 'User ID is required' });
    }

    const applications = await JobApplication.find({ applicantId: req.userId })
      .populate('jobId')
      .sort({ createdAt: -1 });
    res.json(applications);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching applications' });
  }
});

// Get applications for a specific job
router.get('/job/:jobId', [auth, checkRole(['employer'])], async (req: Request, res: Response) => {
  try {
    if (!req.userId) {
      return res.status(401).json({ message: 'User ID is required' });
    }

    const job = await JobListing.findOne({
      _id: req.params.jobId,
      employerId: req.userId,
    });

    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    const applications = await JobApplication.find({ jobId: req.params.jobId })
      .populate('applicantId', 'fullName email')
      .sort({ createdAt: -1 });
    res.json(applications);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching applications' });
  }
});

// Application body interface
interface ApplicationBody {
  jobId: string;
  coverLetter?: string;
}

// Submit new application
router.post(
  '/',
  [auth, checkRole(['jobseeker']), upload.single('resume')],
  async (req: Request<{}, {}, ApplicationBody>, res: Response) => {
    try {
      if (!req.userId) {
        return res.status(401).json({ message: 'User ID is required' });
      }

      const { jobId, coverLetter } = req.body;

      if (!req.file || !req.file.public_id) {
        return res.status(400).json({ message: 'Resume file is required' });
      }

      const job = await JobListing.findOne({
        _id: jobId,
        status: 'open',
      }).populate<{ employerId: UserDocument }>('employerId');

      if (!job) {
        await deleteFile(req.file.public_id);
        return res.status(404).json({ message: 'Job not found or closed' });
      }

      // Check if already applied
      const existingApplication = await JobApplication.findOne({
        jobId,
        applicantId: req.userId,
      });

      if (existingApplication) {
        await deleteFile(req.file.public_id);
        return res.status(400).json({ message: 'Already applied to this job' });
      }

      const applicant = await User.findById(req.userId);
      if (!applicant) {
        await deleteFile(req.file.public_id);
        return res.status(404).json({ message: 'Applicant not found' });
      }

      const application = new JobApplication({
        jobId,
        applicantId: req.userId,
        resumeUrl: req.file.path,
        resumePublicId: req.file.public_id,
        coverLetter,
        status: 'pending',
      });

      await application.save();

      // Send notification to employer
      await sendApplicationNotification(
        job.employerId,
        job.title,
        applicant.fullName
      );

      res.status(201).json(application);
    } catch (error) {
      if (req.file?.public_id) {
        await deleteFile(req.file.public_id);
      }
      res.status(500).json({ message: 'Error submitting application' });
    }
  }
);

interface StatusUpdateBody {
  status: 'pending' | 'reviewed' | 'accepted' | 'rejected';
}

// Update application status
router.patch(
  '/:id/status',
  [auth, checkRole(['employer'])],
  async (req: Request<{ id: string }, {}, StatusUpdateBody>, res: Response) => {
    try {
      if (!req.userId) {
        return res.status(401).json({ message: 'User ID is required' });
      }

      const { status } = req.body;
      const application = await JobApplication.findById(req.params.id)
        .populate<{ jobId: JobListingDocument }>('jobId')
        .populate<{ applicantId: UserDocument }>('applicantId');

      if (!application) {
        return res.status(404).json({ message: 'Application not found' });
      }

      // Verify employer owns the job
      if (application.jobId.employerId.toString() !== req.userId) {
        return res.status(403).json({ message: 'Not authorized' });
      }

      application.status = status;
      await application.save();

      // Send notification to applicant
      await sendApplicationStatusUpdate(
        application.applicantId,
        application.jobId.title,
        status
      );

      res.json(application);
    } catch (error) {
      res.status(500).json({ message: 'Error updating application status' });
    }
  }
);

// Delete application
router.delete('/:id', [auth], async (req: Request, res: Response) => {
  try {
    if (!req.userId) {
      return res.status(401).json({ message: 'User ID is required' });
    }

    const application = await JobApplication.findOne({
      _id: req.params.id,
      applicantId: req.userId
    });

    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    if (application.resumePublicId) {
      await deleteFile(application.resumePublicId);
    }

    await application.deleteOne();
    res.json({ message: 'Application deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting application' });
  }
});

export default router;
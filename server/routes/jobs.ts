import express, { Response } from 'express';
import { auth, checkRole } from '../middleware/auth';
import JobListing from '../models/JobListing';
import { AuthRequest } from '../types';

const router = express.Router();

interface QueryParams {
  search?: string;
  location?: string;
  salaryMin?: string;
  salaryMax?: string;
  page?: string;
  limit?: string;
}

// Get all job listings with search and filters
router.get('/', async (req: AuthRequest & { query: QueryParams }, res: Response) => {
  try {
    const { 
      search, 
      location, 
      salaryMin, 
      salaryMax,
      page = '1',
      limit = '10'
    } = req.query;

    const query: any = { status: 'open' };

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { company: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    if (location) {
      query.location = { $regex: location, $options: 'i' };
    }

    if (salaryMin || salaryMax) {
      query.salaryRange = {};
      if (salaryMin) query.salaryRange.$gte = parseInt(salaryMin);
      if (salaryMax) query.salaryRange.$lte = parseInt(salaryMax);
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [jobs, total] = await Promise.all([
      JobListing.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit)),
      JobListing.countDocuments(query)
    ]);

    res.json({
      jobs,
      pagination: {
        total,
        pages: Math.ceil(total / parseInt(limit)),
        page: parseInt(page),
        limit: parseInt(limit)
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching jobs' });
  }
});

// Get single job listing
router.get('/:id', auth, async (req: AuthRequest, res: Response) => {
  try {
    const job = await JobListing.findById(req.params.id);
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }
    res.json(job);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching job' });
  }
});

interface CreateJobRequest extends AuthRequest {
  body: {
    title: string;
    company: string;
    description: string;
    requirements: string[];
    salaryRange: string;
    location: string;
  };
}

// Create job listing (employers only)
router.post('/', [auth, checkRole(['employer'])], async (req: CreateJobRequest, res: Response) => {
  try {
    const { title, company, description, requirements, salaryRange, location } = req.body;

    const job = new JobListing({
      title,
      company,
      description,
      requirements,
      salaryRange,
      location,
      employerId: req.userId,
      status: 'open'
    });

    await job.save();
    res.status(201).json(job);
  } catch (error) {
    res.status(500).json({ message: 'Error creating job listing' });
  }
});

// Update job listing (employers only)
router.put('/:id', [auth, checkRole(['employer'])], async (req: CreateJobRequest, res: Response) => {
  try {
    const job = await JobListing.findOne({
      _id: req.params.id,
      employerId: req.userId
    });

    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    Object.assign(job, req.body);
    await job.save();
    res.json(job);
  } catch (error) {
    res.status(500).json({ message: 'Error updating job listing' });
  }
});

// Close job listing (employers only)
router.patch('/:id/close', [auth, checkRole(['employer'])], async (req: AuthRequest, res: Response) => {
  try {
    const job = await JobListing.findOne({
      _id: req.params.id,
      employerId: req.userId
    });

    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    job.status = 'closed';
    await job.save();
    res.json(job);
  } catch (error) {
    res.status(500).json({ message: 'Error closing job listing' });
  }
});

// Get employer's job listings
router.get('/employer/listings', [auth, checkRole(['employer'])], async (req: AuthRequest, res: Response) => {
  try {
    const jobs = await JobListing.find({ employerId: req.userId })
      .sort({ createdAt: -1 });
    res.json({ jobs });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching job listings' });
  }
});

// Get job statistics for employer
router.get('/stats', [auth, checkRole(['employer'])], async (req: AuthRequest, res: Response) => {
  try {
    const [activeJobs, totalApplications, recentApplications] = await Promise.all([
      JobListing.countDocuments({ employerId: req.userId, status: 'open' }),
      JobListing.aggregate([
        { $match: { employerId: req.userId } },
        { $lookup: {
            from: 'jobapplications',
            localField: '_id',
            foreignField: 'jobId',
            as: 'applications'
          }
        },
        { $group: {
            _id: null,
            total: { $sum: { $size: '$applications' } }
          }
        }
      ]),
      JobListing.aggregate([
        { $match: { employerId: req.userId } },
        { $lookup: {
            from: 'jobapplications',
            localField: '_id',
            foreignField: 'jobId',
            as: 'applications'
          }
        },
        { $unwind: '$applications' },
        { $match: {
            'applications.createdAt': {
              $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
            }
          }
        },
        { $count: 'recent' }
      ])
    ]);

    res.json({
      activeJobs,
      totalApplications: totalApplications[0]?.total || 0,
      recentApplications: recentApplications[0]?.recent || 0
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching statistics' });
  }
});

export default router;
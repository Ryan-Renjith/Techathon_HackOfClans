import express, { Response } from 'express';
import { auth } from '../middleware/auth';
import Profile from '../models/Profile';
import { AuthRequest } from '../types';

const router = express.Router();

// Get user profile
router.get('/:userId', auth, async (req: AuthRequest, res: Response) => {
  try {
    const profile = await Profile.findOne({ userId: req.params.userId });
    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }
    res.json(profile);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching profile' });
  }
});

interface ProfileRequest extends AuthRequest {
  body: {
    bio?: string;
    skills: string[];
    experience?: string;
    education?: string;
    contactInfo: {
      phone?: string;
      address?: string;
      linkedin?: string;
    };
  };
}

// Create or update profile
router.put('/', auth, async (req: ProfileRequest, res: Response) => {
  try {
    const { bio, skills, experience, education, contactInfo } = req.body;

    const profile = await Profile.findOneAndUpdate(
      { userId: req.userId },
      {
        userId: req.userId,
        bio,
        skills,
        experience,
        education,
        contactInfo
      },
      { new: true, upsert: true }
    );

    res.json(profile);
  } catch (error) {
    res.status(500).json({ message: 'Error updating profile' });
  }
});

export default router;
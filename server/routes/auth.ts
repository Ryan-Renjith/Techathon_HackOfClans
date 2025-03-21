import express, { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User';

const router = express.Router();

interface RegisterRequest extends Request {
  body: {
    email: string;
    password: string;
    fullName: string;
    role: 'employer' | 'jobseeker';
  };
}

interface LoginRequest extends Request {
  body: {
    email: string;
    password: string;
  };
}

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict' as const,
  maxAge: 24 * 60 * 60 * 1000 // 24 hours
};

router.post('/register', async (req: RegisterRequest, res: Response) => {
  try {
    const { email, password, fullName, role } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const user = new User({
      email,
      password,
      fullName,
      role
    });

    await user.save();

    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET!,
      { expiresIn: '24h' }
    );

    res.cookie('token', token, COOKIE_OPTIONS);

    res.status(201).json({
      user: {
        _id: user._id,
        email: user.email,
        fullName: user.fullName,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Error creating user' });
  }
});

router.post('/login', async (req: LoginRequest, res: Response) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET!,
      { expiresIn: '24h' }
    );

    res.cookie('token', token, COOKIE_OPTIONS);

    res.json({
      user: {
        _id: user._id,
        email: user.email,
        fullName: user.fullName,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Error logging in' });
  }
});

router.post('/logout', (req: Request, res: Response) => {
  res.clearCookie('token', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict'
  });
  res.json({ message: 'Logged out successfully' });
});

export default router;
import { Request } from 'express';

// This interface is kept for backward compatibility and extending with additional properties if needed
export interface AuthRequest extends Request {
  // Additional custom properties can be added here
}
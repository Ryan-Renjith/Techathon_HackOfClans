import { Request, Response, NextFunction } from 'express';
import { AppError, ErrorResponse } from '../types/error';
import { deleteFile } from '../config/upload';

export const errorHandler = async (
  err: Error | AppError,
  req: Request,
  res: Response<ErrorResponse>,
  next: NextFunction
) => {
  // Clean up uploaded file if there's an error
  if (req.file?.public_id) {
    try {
      await deleteFile(req.file.public_id);
    } catch (deleteError) {
      console.error('Error deleting file during error handling:', deleteError);
    }
  }

  // Handle known application errors
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      message: err.message,
      error: err.name,
      stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
  }

  // Handle validation errors
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      message: 'Validation Error',
      error: err.name,
      details: err.message,
      stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
  }

  // Handle MongoDB duplicate key errors
  if (err.name === 'MongoServerError' && (err as any).code === 11000) {
    return res.status(409).json({
      message: 'Duplicate Entry',
      error: err.name,
      details: 'A record with this information already exists',
      stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
  }

  // Handle default errors
  console.error('Unhandled error:', err);
  res.status(500).json({
    message: 'Internal server error',
    error: err.name,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
};
import { body, param, validationResult } from 'express-validator';
import { Request, Response, NextFunction } from 'express';

export const validate = (validations: any[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    await Promise.all(validations.map(validation => validation.run(req)));

    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    }

    return res.status(400).json({
      errors: errors.array().map(err => ({
        field: err.path,
        message: err.msg
      }))
    });
  };
};

export const jobValidation = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Job title is required')
    .isLength({ min: 3, max: 100 })
    .withMessage('Job title must be between 3 and 100 characters'),
  
  body('company')
    .trim()
    .notEmpty()
    .withMessage('Company name is required')
    .isLength({ min: 2, max: 100 })
    .withMessage('Company name must be between 2 and 100 characters'),
  
  body('description')
    .trim()
    .notEmpty()
    .withMessage('Job description is required')
    .isLength({ min: 50, max: 5000 })
    .withMessage('Description must be between 50 and 5000 characters'),
  
  body('requirements')
    .isArray()
    .withMessage('Requirements must be an array')
    .notEmpty()
    .withMessage('At least one requirement is required'),
  
  body('requirements.*')
    .trim()
    .notEmpty()
    .withMessage('Each requirement must not be empty')
    .isLength({ min: 3, max: 200 })
    .withMessage('Each requirement must be between 3 and 200 characters'),
  
  body('location')
    .trim()
    .notEmpty()
    .withMessage('Location is required')
    .isLength({ min: 2, max: 100 })
    .withMessage('Location must be between 2 and 100 characters'),
  
  body('salaryRange')
    .trim()
    .notEmpty()
    .withMessage('Salary range is required')
    .matches(/^[\$£€]?\d{1,3}(,\d{3})*(\s*-\s*[\$£€]?\d{1,3}(,\d{3})*)?$/)
    .withMessage('Invalid salary range format')
];

export const applicationValidation = [
  body('jobId')
    .trim()
    .notEmpty()
    .withMessage('Job ID is required')
    .isMongoId()
    .withMessage('Invalid job ID'),
  
  body('coverLetter')
    .optional()
    .trim()
    .isLength({ max: 5000 })
    .withMessage('Cover letter must not exceed 5000 characters')
];

export const profileValidation = [
  body('bio')
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('Bio must not exceed 1000 characters'),
  
  body('skills')
    .isArray()
    .withMessage('Skills must be an array'),
  
  body('skills.*')
    .trim()
    .notEmpty()
    .withMessage('Each skill must not be empty')
    .isLength({ min: 2, max: 50 })
    .withMessage('Each skill must be between 2 and 50 characters'),
  
  body('experience')
    .optional()
    .trim()
    .isLength({ max: 2000 })
    .withMessage('Experience must not exceed 2000 characters'),
  
  body('education')
    .optional()
    .trim()
    .isLength({ max: 2000 })
    .withMessage('Education must not exceed 2000 characters'),
  
  body('contactInfo.phone')
    .optional()
    .trim()
    .matches(/^\+?[\d\s-()]{10,20}$/)
    .withMessage('Invalid phone number format'),
  
  body('contactInfo.address')
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage('Address must not exceed 200 characters'),
  
  body('contactInfo.linkedin')
    .optional()
    .trim()
    .isURL()
    .withMessage('Invalid LinkedIn URL')
];
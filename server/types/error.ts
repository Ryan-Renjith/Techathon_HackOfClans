export class AppError extends Error {
  constructor(
    public statusCode: number,
    message: string,
    public isOperational = true,
    public details?: unknown
  ) {
    super(message);
    Object.setPrototypeOf(this, AppError.prototype);
  }
}

export interface ErrorResponse {
  message: string;
  error?: string;
  details?: unknown;
  stack?: string;
}

export class ValidationError extends AppError {
  constructor(message: string, details?: unknown) {
    super(400, message, true, details);
    this.name = 'ValidationError';
  }
}

export class AuthenticationError extends AppError {
  constructor(message: string = 'Authentication required') {
    super(401, message, true);
    this.name = 'AuthenticationError';
  }
}

export class AuthorizationError extends AppError {
  constructor(message: string = 'Access denied') {
    super(403, message, true);
    this.name = 'AuthorizationError';
  }
}

export class NotFoundError extends AppError {
  constructor(resource: string) {
    super(404, `${resource} not found`, true);
    this.name = 'NotFoundError';
  }
}
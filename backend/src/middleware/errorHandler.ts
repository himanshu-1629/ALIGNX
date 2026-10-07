import { Request, Response, NextFunction } from 'express';
import { sendError } from '../utils/apiResponse';

export class AppError extends Error {
  public statusCode: number;
  public code: string;
  public details?: any;

  constructor(message: string, statusCode = 400, code = 'BAD_REQUEST', details?: any) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
    Object.setPrototypeOf(this, AppError.prototype);
  }
}

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction
): void => {
  console.error(`[Error] ${req.method} ${req.originalUrl}:`, err);

  if (err instanceof AppError) {
    sendError({
      res,
      statusCode: err.statusCode,
      code: err.code,
      message: err.message,
      details: err.details
    });
    return;
  }

  // Handle Mongoose Validation Error
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors || {}).map((e: any) => e.message);
    sendError({
      res,
      statusCode: 422,
      code: 'VALIDATION_ERROR',
      message: messages.join(', ') || 'Validation error'
    });
    return;
  }

  // Handle Mongoose Duplicate Key Error (E11000)
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue || {})[0] || 'field';
    sendError({
      res,
      statusCode: 409,
      code: 'DUPLICATE_KEY',
      message: `A record with this ${field} already exists`
    });
    return;
  }

  // Handle JWT Errors
  if (err.name === 'JsonWebTokenError') {
    sendError({
      res,
      statusCode: 401,
      code: 'INVALID_TOKEN',
      message: 'Invalid authentication token'
    });
    return;
  }

  if (err.name === 'TokenExpiredError') {
    sendError({
      res,
      statusCode: 401,
      code: 'TOKEN_EXPIRED',
      message: 'Authentication token has expired'
    });
    return;
  }

  // Default Internal Server Error
  sendError({
    res,
    statusCode: 500,
    code: 'INTERNAL_SERVER_ERROR',
    message: err.message || 'Internal server error',
    details: err.stack
  });
};

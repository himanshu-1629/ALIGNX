import { Response } from 'express';

export interface ApiResponseOptions<T = any> {
  res: Response;
  statusCode?: number;
  data?: T;
  message?: string;
}

export interface ApiErrorOptions {
  res: Response;
  statusCode?: number;
  code?: string;
  message: string;
  details?: any;
}

/**
 * Standard Success Response Format
 */
export const sendSuccess = <T = any>({
  res,
  statusCode = 200,
  data = {} as T,
  message = 'Request successful'
}: ApiResponseOptions<T>): Response => {
  return res.status(statusCode).json({
    success: true,
    data,
    message
  });
};

/**
 * Standard Error Response Format
 */
export const sendError = ({
  res,
  statusCode = 500,
  code = 'INTERNAL_ERROR',
  message = 'An unexpected error occurred',
  details
}: ApiErrorOptions): Response => {
  const payload: Record<string, any> = {
    success: false,
    error: {
      code,
      message
    }
  };

  if (details && process.env.NODE_ENV !== 'production') {
    payload.error.details = details;
  }

  return res.status(statusCode).json(payload);
};

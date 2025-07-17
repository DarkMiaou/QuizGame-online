import { Request, Response, NextFunction } from 'express';
import config from '../config/default';

interface AppError extends Error {
  status?: number;
  details?: any;
}

function errorHandler(
  err: AppError,
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  const statusCode = err.status ?? 500;

  const errorResponse: Record<string, any> = {
    status: statusCode,
    message: err.message || 'Internal Server Error',
  };

  if (config.env === 'development') {
    errorResponse.stack = err.stack;
    if (err.details) {
      errorResponse.details = err.details;
    }
  }

  res.status(statusCode).json(errorResponse);
}

export default errorHandler;

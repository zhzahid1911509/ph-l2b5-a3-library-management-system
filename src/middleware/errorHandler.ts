import { Request, Response, NextFunction } from 'express';
import { Error as MongooseError } from 'mongoose';
import { ErrorResponse } from '../interfaces/response.interface';

export const errorHandler = (
  error: any,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  let statusCode = 500;
  let message = 'Internal server error';
  let errorObj = error;

  // Mongoose validation error
  if (error instanceof MongooseError.ValidationError) {
    statusCode = 400;
    message = 'Validation failed';
    errorObj = {
      name: error.name,
      errors: error.errors
    };
  }
  
  // Mongoose duplicate key error
  else if (error.code === 11000) {
    statusCode = 400;
    message = 'Duplicate entry';
    const field = Object.keys(error.keyValue)[0];
    errorObj = {
      message: `${field} already exists`,
      field,
      value: error.keyValue[field]
    };
  }
  
  // Mongoose cast error (invalid ObjectId)
  else if (error instanceof MongooseError.CastError) {
    statusCode = 400;
    message = 'Invalid ID format';
    errorObj = {
      message: `Invalid ${error.path}: ${error.value}`,
      path: error.path,
      value: error.value
    };
  }
  
  // Custom application errors
  else if (error.status) {
    statusCode = error.status;
    message = error.message;
  }

  const errorResponse: ErrorResponse = {
    message,
    success: false,
    error: errorObj
  };

  res.status(statusCode).json(errorResponse);
};
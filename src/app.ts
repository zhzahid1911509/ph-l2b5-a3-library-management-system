import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import routes from './routes';
import { errorHandler } from './middleware/errorHandler';
import { ApiResponse } from './interfaces/response.interface';

const app: Application = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Routes
app.use('/api', routes);

// Root endpoint
app.get('/', (req: Request, res: Response) => {
  const response: ApiResponse = {
    success: true,
    message: 'Welcome to Library Management API',
    data: {
      version: '1.0.0',
      description: 'A comprehensive library management system built with Express, TypeScript, and MongoDB',
      endpoints: {
        books: '/api/books',
        borrow: '/api/borrow',
        health: '/api/health'
      }
    }
  };
  res.status(200).json(response);
});

// Handle undefined routes
app.all('*', (req: Request, res: Response) => {
  const response: ApiResponse = {
    success: false,
    message: `Route ${req.originalUrl} not found`
  };
  res.status(404).json(response);
});

// Global error handler (must be last)
app.use(errorHandler);

export default app;
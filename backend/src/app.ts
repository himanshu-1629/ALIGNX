import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import apiRouter from './routes';
import { errorHandler, AppError } from './middleware/errorHandler';

export const createApp = (): Application => {
  const app: Application = express();

  // Enable CORS
  app.use(
    cors({
      origin: '*', // Allow frontend dev servers (Vite: 5173, Next.js: 3000, etc.)
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
      allowedHeaders: [
        'Content-Type',
        'Authorization',
        'x-student-id',
        'X-Student-Id',
        'Accept',
        'Origin',
        'X-Requested-With'
      ]
    })
  );

  // Body Parsing Middleware
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));

  // Request logging in development
  if (process.env.NODE_ENV !== 'test') {
    app.use((req: Request, res: Response, next: NextFunction) => {
      console.log(`[HTTP] ${req.method} ${req.path}`);
      next();
    });
  }

  // Root Welcome & Health Check
  app.get('/', (req: Request, res: Response) => {
    res.json({
      name: 'ALIGNX API',
      version: '1.0.0',
      description: 'AI-Powered Career Intelligence Platform',
      documentation: '/api/v1/health'
    });
  });

  // Mount API v1 Router
  app.use('/api/v1', apiRouter);

  // Handle 404 for unmatched routes
  app.use('*', (req: Request, res: Response, next: NextFunction) => {
    next(new AppError(`Cannot ${req.method} ${req.originalUrl} - Route not found`, 404, 'NOT_FOUND'));
  });

  // Central Error Handling Middleware
  app.use(errorHandler);

  return app;
};

export default createApp;

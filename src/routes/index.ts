import { Router } from 'express';
import bookRoutes from './book.routes';
import borrowRoutes from './borrow.routes';

const router = Router();

// Mount routes
router.use('/books', bookRoutes);
router.use('/borrow', borrowRoutes);

// Health check endpoint
router.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Library Management API is running',
    timestamp: new Date().toISOString()
  });
});

export default router;
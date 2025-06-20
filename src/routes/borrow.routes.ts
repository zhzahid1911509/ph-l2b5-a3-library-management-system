import { Router } from 'express';
import { BorrowController } from '../controllers/borrow.controller';

const router = Router();

// POST /api/borrow - Borrow a book
router.post('/', BorrowController.borrowBook);

// GET /api/borrow - Get borrowed books summary
router.get('/', BorrowController.getBorrowedBooksSummary);

export default router;
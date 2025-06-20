import { Router } from 'express';
import { BookController } from '../controllers/book.controller';

const router = Router();

// POST /api/books - Create a new book
router.post('/', BookController.createBook);

// GET /api/books - Get all books with filtering and sorting
router.get('/', BookController.getAllBooks);

// GET /api/books/:bookId - Get book by ID
router.get('/:bookId', BookController.getBookById);

// PUT /api/books/:bookId - Update book
router.put('/:bookId', BookController.updateBook);

// DELETE /api/books/:bookId - Delete book
router.delete('/:bookId', BookController.deleteBook);

export default router;
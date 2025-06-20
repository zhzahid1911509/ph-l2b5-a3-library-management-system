import { Request, Response, NextFunction } from 'express';
import { Book } from '../models/book.model';
import { ApiResponse } from '../interfaces/response.interface';
import { Genre } from '../interfaces/book.interface';
import { Types } from 'mongoose';

export class BookController {
  // Create a new book
  static async createBook(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const book = new Book(req.body);
      await book.save();
      
      const response: ApiResponse = {
        success: true,
        message: 'Book created successfully',
        data: book
      };
      
      res.status(201).json(response);
    } catch (error) {
      next(error);
    }
  }

  // Get all books with filtering and sorting
  static async getAllBooks(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { filter, sort = 'asc', sortBy = 'createdAt', limit = '10' } = req.query;
      
      // Build query
      let query: any = {};
      if (filter && Object.values(Genre).includes(filter as Genre)) {
        query.genre = filter;
      }
      
      // Build sort object
      const sortObj: any = {};
      sortObj[sortBy as string] = sort === 'desc' ? -1 : 1;
      
      const books = await Book.find(query)
        .sort(sortObj)
        .limit(parseInt(limit as string))
        .exec();
      
      const response: ApiResponse = {
        success: true,
        message: 'Books retrieved successfully',
        data: books
      };
      
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  // Get book by ID
  static async getBookById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { bookId } = req.params;
      
      if (!Types.ObjectId.isValid(bookId)) {
        const response: ApiResponse = {
          success: false,
          message: 'Invalid book ID format'
        };
        res.status(400).json(response);
        return;
      }
      
      const book = await Book.findById(bookId);
      
      if (!book) {
        const response: ApiResponse = {
          success: false,
          message: 'Book not found'
        };
        res.status(404).json(response);
        return;
      }
      
      const response: ApiResponse = {
        success: true,
        message: 'Book retrieved successfully',
        data: book
      };
      
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  // Update book
  static async updateBook(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { bookId } = req.params;
      
      if (!Types.ObjectId.isValid(bookId)) {
        const response: ApiResponse = {
          success: false,
          message: 'Invalid book ID format'
        };
        res.status(400).json(response);
        return;
      }
      
      const book = await Book.findByIdAndUpdate(
        bookId,
        req.body,
        { new: true, runValidators: true }
      );
      
      if (!book) {
        const response: ApiResponse = {
          success: false,
          message: 'Book not found'
        };
        res.status(404).json(response);
        return;
      }
      
      const response: ApiResponse = {
        success: true,
        message: 'Book updated successfully',
        data: book
      };
      
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  // Delete book
  static async deleteBook(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { bookId } = req.params;
      
      if (!Types.ObjectId.isValid(bookId)) {
        const response: ApiResponse = {
          success: false,
          message: 'Invalid book ID format'
        };
        res.status(400).json(response);
        return;
      }
      
      const book = await Book.findByIdAndDelete(bookId);
      
      if (!book) {
        const response: ApiResponse = {
          success: false,
          message: 'Book not found'
        };
        res.status(404).json(response);
        return;
      }
      
      const response: ApiResponse = {
        success: true,
        message: 'Book deleted successfully',
        data: null
      };
      
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }
}
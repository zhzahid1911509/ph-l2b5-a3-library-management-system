import { Request, Response, NextFunction } from 'express';
import { Book } from '../models/book.model';
import { Borrow } from '../models/borrow.model';
import { ApiResponse } from '../interfaces/response.interface';
import { IBorrowSummary } from '../interfaces/borrow.interface';
import { Types } from 'mongoose';

export class BorrowController {
  // Borrow a book
  static async borrowBook(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { book: bookId, quantity, dueDate } = req.body;
      
      // Validate ObjectId
      if (!Types.ObjectId.isValid(bookId)) {
        const response: ApiResponse = {
          success: false,
          message: 'Invalid book ID format'
        };
        res.status(400).json(response);
        return;
      }
      
      // Find the book
      const book = await Book.findById(bookId);
      if (!book) {
        const response: ApiResponse = {
          success: false,
          message: 'Book not found'
        };
        res.status(404).json(response);
        return;
      }
      
      // Check if enough copies are available
      if (book.copies < quantity) {
        const response: ApiResponse = {
          success: false,
          message: `Not enough copies available. Only ${book.copies} copies remaining.`
        };
        res.status(400).json(response);
        return;
      }
      
      // Check if book is available
      if (!book.available) {
        const response: ApiResponse = {
          success: false,
          message: 'Book is currently not available for borrowing'
        };
        res.status(400).json(response);
        return;
      }
      
      // Create borrow record
      const borrowRecord = new Borrow({
        book: bookId,
        quantity,
        dueDate: new Date(dueDate)
      });
      
      // Update book copies
      book.copies -= quantity;
      
      // Use instance method to update availability
      await book.updateAvailability();
      
      // Save borrow record
      await borrowRecord.save();
      
      const response: ApiResponse = {
        success: true,
        message: 'Book borrowed successfully',
        data: borrowRecord
      };
      
      res.status(201).json(response);
    } catch (error) {
      next(error);
    }
  }

  // Get borrowed books summary using aggregation
  static async getBorrowedBooksSummary(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      // Aggregation pipeline to get borrowed books summary
      const borrowSummary = await Borrow.aggregate([
        {
          // Group by book and sum quantities
          $group: {
            _id: '$book',
            totalQuantity: { $sum: '$quantity' }
          }
        },
        {
          // Lookup book details
          $lookup: {
            from: 'books',
            localField: '_id',
            foreignField: '_id',
            as: 'bookDetails'
          }
        },
        {
          // Unwind the book details array
          $unwind: '$bookDetails'
        },
        {
          // Project only required fields
          $project: {
            _id: 0,
            book: {
              title: '$bookDetails.title',
              isbn: '$bookDetails.isbn'
            },
            totalQuantity: 1
          }
        },
        {
          // Sort by total quantity descending
          $sort: { totalQuantity: -1 }
        }
      ]);
      
      const response: ApiResponse<IBorrowSummary[]> = {
        success: true,
        message: 'Borrowed books summary retrieved successfully',
        data: borrowSummary
      };
      
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }
}
import { Schema, model, Model } from 'mongoose';
import { IBook, IBookMethods, IBookStatics, Genre } from '../interfaces/book.interface';

type BookModel = Model<IBook, {}, IBookMethods> & IBookStatics;

const bookSchema = new Schema<IBook, BookModel, IBookMethods>({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true
  },
  author: {
    type: String,
    required: [true, 'Author is required'],
    trim: true
  },
  genre: {
    type: String,
    required: [true, 'Genre is required'],
    enum: {
      values: Object.values(Genre),
      message: 'Genre must be one of: FICTION, NON_FICTION, SCIENCE, HISTORY, BIOGRAPHY, FANTASY'
    }
  },
  isbn: {
    type: String,
    required: [true, 'ISBN is required'],
    unique: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  copies: {
    type: Number,
    required: [true, 'Copies is required'],
    min: [0, 'Copies must be a positive number']
  },
  available: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Instance method
bookSchema.methods.updateAvailability = async function(): Promise<void> {
  this.available = this.copies > 0;
  await this.save();
};

// Static methods
bookSchema.statics.findAvailableBooks = function(): Promise<IBook[]> {
  return this.find({ available: true });
};

bookSchema.statics.findByGenre = function(genre: Genre): Promise<IBook[]> {
  return this.find({ genre });
};

// Pre middleware - Update availability before saving
bookSchema.pre('save', function(next) {
  if (this.isModified('copies')) {
    this.available = this.copies > 0;
  }
  next();
});

// Post middleware - Log when a book is created
bookSchema.post('save', function(doc) {
  if (this.isNew) {
    console.log(`New book created: ${doc.title} by ${doc.author}`);
  }
});

// Create unique index for ISBN
bookSchema.index({ isbn: 1 }, { unique: true });

export const Book = model<IBook, BookModel>('Book', bookSchema);
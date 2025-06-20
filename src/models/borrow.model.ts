import { Schema, model, Types } from 'mongoose';
import { IBorrow } from '../interfaces/borrow.interface';

const borrowSchema = new Schema<IBorrow>({
  book: {
    type: Schema.Types.ObjectId,
    ref: 'Book',
    required: [true, 'Book reference is required']
  },
  quantity: {
    type: Number,
    required: [true, 'Quantity is required'],
    min: [1, 'Quantity must be at least 1']
  },
  dueDate: {
    type: Date,
    required: [true, 'Due date is required'],
    validate: {
      validator: function(value: Date) {
        return value > new Date();
      },
      message: 'Due date must be in the future'
    }
  }
}, {
  timestamps: true
});

// Pre middleware - Log when a book is borrowed
borrowSchema.pre('save', function(next) {
  if (this.isNew) {
    console.log(`Book borrowed: ${this.book}, Quantity: ${this.quantity}`);
  }
  next();
});

// Post middleware - Log after borrow is saved
borrowSchema.post('save', function(doc) {
  console.log(`Borrow record saved with ID: ${doc._id}`);
});

export const Borrow = model<IBorrow>('Borrow', borrowSchema);
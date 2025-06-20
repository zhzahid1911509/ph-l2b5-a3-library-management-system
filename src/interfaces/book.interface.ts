import { Document } from 'mongoose';

export enum Genre {
  FICTION = 'FICTION',
  NON_FICTION = 'NON_FICTION',
  SCIENCE = 'SCIENCE',
  HISTORY = 'HISTORY',
  BIOGRAPHY = 'BIOGRAPHY',
  FANTASY = 'FANTASY'
}

export interface IBook extends Document {
  title: string;
  author: string;
  genre: Genre;
  isbn: string;
  description?: string;
  copies: number;
  available: boolean;
  createdAt: Date;
  updatedAt: Date;
  
  // Instance method
  updateAvailability(): Promise<void>;
}

export interface IBookMethods {
  updateAvailability(): Promise<void>;
}

export interface IBookStatics {
  findAvailableBooks(): Promise<IBook[]>;
  findByGenre(genre: Genre): Promise<IBook[]>;
}
# 📚 Library Management API

A comprehensive Library Management System built with **Express**, **TypeScript**, and **MongoDB** using Mongoose.

## 🚀 Features

- ✅ **Complete CRUD operations** for books
- ✅ **Book borrowing system** with availability tracking
- ✅ **Advanced filtering and sorting** for book queries
- ✅ **MongoDB aggregation pipeline** for borrowed books summary
- ✅ **Mongoose static and instance methods**
- ✅ **Mongoose middleware** (pre/post hooks)
- ✅ **Comprehensive validation** with proper error handling
- ✅ **TypeScript** for type safety
- ✅ **Proper project structure** following best practices

## 🛠️ Tech Stack

- **Backend**: Node.js, Express.js
- **Language**: TypeScript
- **Database**: MongoDB with Mongoose ODM
- **Validation**: Mongoose built-in validators
- **Error Handling**: Custom middleware

## 📋 Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or MongoDB Atlas)
- npm 

## ⚡ Quick Start

### 1. Clone and Install

```bash
git clone <repository-url>
cd library-management-api
npm install
```

### 2. Environment Setup

Create a `.env` file in the root directory:

```env
PORT=5000
MONGODB_URI=mongodb+srv://<db_username>:<db_password>@cluster0.egki16d.mongodb.net/<db_name>?retryWrites=true&w=majority&appName=Cluster0
NODE_ENV=development
```

### 3. Start MongoDB

Make sure MongoDB is running on your local machine or update the `MONGODB_URI` in `.env` to point to your MongoDB Atlas cluster.

### 4. Run the Application

```bash
# Development mode
npm run dev

# Production build and start
npm run build
npm start
```

The API will be available at `http://localhost:5000`

## 📚 API Endpoints

### Books

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/books` | Create a new book |
| GET | `/api/books` | Get all books (with filtering & sorting) |
| GET | `/api/books/:bookId` | Get book by ID |
| PUT | `/api/books/:bookId` | Update book |
| DELETE | `/api/books/:bookId` | Delete book |

### Borrowing

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/borrow` | Borrow a book |
| GET | `/api/borrow` | Get borrowed books summary |

### Health Check

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | API health check |

## 📝 API Usage Examples

### Create a Book

```bash
POST /api/books
Content-Type: application/json

{
  "title": "The Theory of Everything",
  "author": "Stephen Hawking",
  "genre": "SCIENCE",
  "isbn": "9780553380163",
  "description": "An overview of cosmology and black holes.",
  "copies": 5,
  "available": true
}
```

### Get Books with Filtering

```bash
GET /api/books?filter=SCIENCE&sortBy=createdAt&sort=desc&limit=5
```

### Borrow a Book

```bash
POST /api/borrow
Content-Type: application/json

{
  "book": "64ab3f9e2a4b5c6d7e8f9012",
  "quantity": 2,
  "dueDate": "2025-07-18T00:00:00.000Z"
}
```

### Get Borrowed Books Summary

```bash
GET /api/borrow
```

## 🔧 Advanced Features

### 1. Mongoose Static Methods
- `Book.findAvailableBooks()` - Find all available books
- `Book.findByGenre(genre)` - Find books by genre

### 2. Mongoose Instance Methods
- `book.updateAvailability()` - Update book availability based on copies

### 3. Mongoose Middleware
- **Pre-save**: Automatically updates availability when copies change
- **Post-save**: Logs when new books are created
- **Pre-save (Borrow)**: Logs borrowing activities
- **Post-save (Borrow)**: Logs successful borrow records

### 4. MongoDB Aggregation Pipeline
The borrowed books summary uses a sophisticated aggregation pipeline:
- Groups borrow records by book
- Sums total quantities borrowed
- Joins with book collection for details
- Returns structured summary data

### 5. Comprehensive Validation
- **Book Model**: Title, author, genre, ISBN (unique), copies validation
- **Borrow Model**: Book reference, quantity (min 1), due date (future date)
- **Custom Validators**: Genre enum validation, positive numbers, future dates

## 🏗️ Project Structure

```
src/
├── config/
│   └── database.ts          # Database connection
├── controllers/
│   ├── book.controller.ts   # Book operations
│   └── borrow.controller.ts # Borrow operations
├── interfaces/
│   ├── book.interface.ts    # Book type definitions
│   ├── borrow.interface.ts  # Borrow type definitions
│   └── response.interface.ts # API response types
├── middleware/
│   └── errorHandler.ts      # Global error handling
├── models/
│   ├── book.model.ts        # Book schema & model
│   └── borrow.model.ts      # Borrow schema & model
├── routes/
│   ├── book.routes.ts       # Book routes
│   ├── borrow.routes.ts     # Borrow routes
│   └── index.ts             # Route aggregation
├── app.ts                   # Express app setup
└── server.ts                # Server entry point
```

## 🎯 Business Logic

### Book Availability Management
- When books are borrowed, the system automatically:
  1. Checks if sufficient copies are available
  2. Reduces the copy count by the borrowed quantity
  3. Updates availability status using instance methods
  4. Prevents borrowing if no copies are available

### Data Integrity
- ISBN uniqueness is enforced at the database level
- All required fields are validated
- Proper error responses for validation failures
- ObjectId validation for all references

## 🛡️ Error Handling

The API includes comprehensive error handling for:
- Validation errors (400)
- Not found errors (404)
- Duplicate key errors (400)
- Invalid ObjectId format (400)
- Server errors (500)

## 🧪 Testing the API

You can test the API using tools like:
- **Postman**: Import the endpoints and test manually
- **cURL**: Use command line to test endpoints
- **Thunder Client** (VS Code extension): Test directly in VS Code

# LMS Backend

This is a backend API for a Learning Management System (LMS) built with Node.js, Express, and MongoDB.

## Prerequisites

- Node.js installed
- MongoDB (local or hosted on MongoDB Atlas)

## Environment Variables

Create a `.env` file in the root directory with the following:

PORT=5000
NODE_ENV=development
MONGODB=mongodb+srv://<username>:<password>@cluster0.mongodb.net/lms
MONGODB_LOCAL=mongodb://localhost:27017/lms
JWT_SECRET=your_secret_key

## How to Run

1. Clone the repository:

git clone <repository_url>

2. Install dependencies:

npm install

3. Run the server:

npm run dev

## Project Structure

src/: Core application source code  

controllers/: Handle incoming requests and business logic  
models/: Define Mongoose schemas and database models  
routes/: Register and organize API endpoints  
middlewares/: Custom middleware for auth, errors, etc.  
validations/: Input validation schemas and rules  
utils/: Shared helper functions and utilities  

app.js: Configure Express app and global middleware  
server.js: Initialize server and connect to database  

## Features

- MongoDB integration

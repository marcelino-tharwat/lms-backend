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

- `src/`: Contains the main code
- `controllers/`: Request handling logic
- `models/`: Mongoose schemas
- `routes/`: API routes
- `app.js`: Express setup
- `server.js`: Main entry point

## Features

- MongoDB integration
